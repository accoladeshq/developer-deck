import 'reflect-metadata';

import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { container } from 'tsyringe';
import { Logger } from './services/logger/logger.service';
import { FileLoggerService } from './services/logger/file-logger.service';
import { ConsoleLoggerService } from './services/logger/console-logger.service';

export class Application {

  /**
   * The service who manage logs
   */
  private readonly _logger: Logger;

  /**
   * The electron application
   */
  private readonly _app;

  /**
   * If the app is running in local mode or not
   */
  private readonly _localMode: boolean;

  /**
   * The application base directory
   */
  private readonly _baseDir: string;

  /**
   * The application shell
   */
  private _shell: BrowserWindow;

  /**
   * Initialize a new @{Application}
   * @param localMode If the application run in local mode or not
   */
  constructor(localMode: boolean, baseDir: string) {
    this._app = app;
    this._shell = null;
    this._localMode = localMode;
    this._baseDir = baseDir;

    this.registerServices();

    this._logger = container.resolve<Logger>('Logger');
  }

  /**
   * Bootstrap the application
   */
  public bootstrap(): void {
    this._logger.info(`Bootstrap application in ${this._localMode ? 'local mode' : 'production mode'}`);

    this._logger.debug('Registering application events');
    this.registerEvents();

    this._logger.debug('Enabling local mode if needed');
    this.enableHotReload();
  }

  /**
   * Register dependency injection services
   */
  private registerServices() {
    if (this._localMode) {
      container.register<Logger>('Logger', { useClass: ConsoleLoggerService });
    } else {
      container.register<Logger>('Logger', { useClass: FileLoggerService });
    }

  }

  /**
   * Register application events
   */
  private registerEvents(): void {
    this._app.on('ready', () => this.onReady());
    this._app.on('window-all-closed', () => this.onAllWindowClosed());
    this._app.on('activate', () => this.onActivated());
  }

  /**
   * Occurs when the application is ready
   */
  private onReady(): void {
    this._logger.debug('Application is ready');
    // test
    this.initializeShell();
  }

  /**
   * Initialize the shell
   */
  private initializeShell(): void {

    if (this._shell != null) {
      this._logger.debug('Shell already exist, passing initialization');
      return;
    }

    this._logger.debug('Initialize shell');

    const shell = this.createShell();
    const homePage = this.getHomePageUrl();

    this._logger.debug(`Navigating to home page ${homePage}`);
    shell.loadURL(homePage);

    if (this._localMode) {
      shell.webContents.openDevTools();
    }
  }

  /**
   * Create application shell
   */
  private createShell(): BrowserWindow {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    const shell = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: (this._localMode) ? true : false,
      },
    });

    shell.on('closed', () => this.onShellClosed());

    return shell;
  }

  /**
   * Occurs when the shell is closed
   */
  private onShellClosed(): void {
    this._logger.debug('Shell is closed, deallocating...');
    if (this._shell != null) {
      this._shell = null;
    }
  }

  /**
   * Occurs when the app is activate
   */
  private onActivated(): void {
    this._logger.debug('Applicaiton is activated');
    this.initializeShell();
  }

  /**
   * Occurs when all window are closed
   */
  private onAllWindowClosed(): void {
    this._logger.debug('All window are closed');

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  /**
   * Enable hot reload if needed
   */
  private enableHotReload(): void {
    if (!this._localMode) {
      this._logger.debug('Application is in local mode, hot reload not enable');
      return;
    }

    this._logger.debug('Application is in local mode, enabling hot reload');
    require('electron-reload')(this._baseDir, {
      electron: require(`${this._baseDir}/node_modules/electron`),
      argv: ['--serve']
    });
  }

  /**
   * Gets the home page url
   */
  private getHomePageUrl(): string {
    if (this._localMode) {
      return 'http://localhost:4200';
    }

    return url.format({
      pathname: path.join(this._baseDir, 'dist/portal/index.html'),
      protocol: 'file:',
      slashes: true
    });
  }
}
