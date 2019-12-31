import { Application } from './projects/server/application';

try {
  const args = process.argv.slice(1);
  const serve = args.some(val => val === '--serve');

  const application = new Application(serve, __dirname);
  application.bootstrap();

} catch (error) {
  console.error(error);
}
