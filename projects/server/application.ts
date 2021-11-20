import 'reflect-metadata';

import { app, BrowserWindow, screen, Tray, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { container } from 'tsyringe';
import { autoUpdater } from 'electron-updater';
import { Logger } from './services/logger/logger.service';
import { FileLoggerService } from './services/logger/file-logger.service';
import { ConsoleLoggerService } from './services/logger/console-logger.service';
import { Loggable } from './services/logger/loggable';

export class Application implements Loggable {

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
  private _shell: BrowserWindow | null;

  /**
   * The application tray
   */
  private _tray: Tray | null;

  /**
   * Initialize a new @{Application}
   * @param localMode If the application run in local mode or not
   */
  constructor(localMode: boolean, baseDir: string) {
    this._app = app;
    this._tray = null;
    this._shell = null;
    this._localMode = localMode;
    this._baseDir = baseDir;

    this.registerServices();

    this._logger = container.resolve<Logger>('Logger');
  }

  /**
   * Gets the class tag
   */
  public get tag(): string {
    return 'Application';
  }

  /**
   * Bootstrap the application
   */
  public bootstrap(): void {
    this._logger.info(this, `Bootstrap in ${this._localMode ? 'local mode' : 'production mode'}`);

    this._logger.debug(this, 'Registering events');
    this.registerEvents();

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
    this._logger.debug(this, 'Application is ready');

    this.initializeShell();

    this.checkUpdates();
  }

  /**
   * Check if the application has updates
   */
  private checkUpdates(): void {
    this._logger.debug(this, 'Check for updates');
    const log = require('electron-log');

    const loggableUpdate: Loggable = {
      tag: 'Updater'
    };

    if (this._localMode) {
      log.transports.file.level = 'debug';
    } else {
      log.transports.file.level = 'info';
    }

    autoUpdater.logger = {
      error: (message) => this._logger.error(loggableUpdate, message),
      info: (message) => this._logger.info(loggableUpdate, message),
      warn: (message) => this._logger.warn(loggableUpdate, message),
      debug: (message) => this._logger.debug(loggableUpdate, message)
    };

    autoUpdater.checkForUpdatesAndNotify();
  }

  /**
   * Initialize the shell
   */
  private initializeShell(): void {

    if (this._shell !== null) {
      this._logger.debug(this, 'Shell already exist, passing initialization');
      return;
    }

    this._logger.debug(this, 'Initialize shell');

    const shell = this.createShell();
    this._shell = shell;

    const homePage = this.getHomePageUrl();

    this._logger.debug(this, `Navigating to home page ${homePage}`);
    shell.loadURL(homePage);

    if (this._localMode) {
      shell.webContents.openDevTools();
    }

    if (this._tray != null) {
      this._tray.destroy();
      this._tray = null;
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
      autoHideMenuBar: true,
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
    this._logger.debug(this, 'Shell closed, deallocating...');
    if (this._shell !== null) {
      this._shell = null;
    }
  }

  /**
   * Occurs when the app is activate
   */
  private onActivated(): void {
    this._logger.debug(this, 'Applicaiton is activated');
    this.initializeShell();
  }

  /**
   * Occurs when all window are closed
   */
  private onAllWindowClosed(): void {
    this._logger.debug(this, 'All window are closed');

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    }

    this.createTray();
  }

  /**
   * Create the application tray
   */
  private createTray(): void {
    this._logger.debug(this, 'Creating application tray');

    const applicationTray = new Tray(path.join(this._baseDir, 'projects', 'portal', 'src', 'favicon.ico'));

    applicationTray.on('double-click', () => {
      this.initializeShell();
    });

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open', type: 'normal', click: () => {
          this.initializeShell();
        }
      },
      { label: 'Quit', type: 'normal', click: () => app.quit() }
    ]);

    applicationTray.setContextMenu(contextMenu);
    this._tray = applicationTray;
  }

  /**
   * Enable hot reload if needed
   */
  private enableHotReload(): void {
    if (!this._localMode) {
      this._logger.debug(this, 'Hot reload not available');
      return;
    }

    this._logger.debug(this, 'Enabling hot reload');
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
