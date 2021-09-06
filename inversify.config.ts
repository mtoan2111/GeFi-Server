import { Container } from 'inversify';
import ILogger from './src/interface/ILogger.interface';
import ITimestamp from './src/interface/ITimestamp.Interface';
import IStorage from './src/interface/IStorage.interface';
import IValidation from './src/interface/IValid.interface';
import Timestamp from './src/helper/Timestamp.helper';
import Storage from './src/helper/Storage.helper';
import Logger from './src/helper/Logger.helper';
import Validation from './src/helper/Valid.helper';
import MatchController from './src/controller/v1/Match.controller';

let container = new Container();

container.bind<IValidation>('Validation').to(Validation).inSingletonScope();
container.bind<IStorage>('Storage').to(Storage).inSingletonScope();
container.bind<ILogger>('Logger').to(Logger).inSingletonScope();
container.bind<ITimestamp>('Timestamp').to(Timestamp).inSingletonScope();
container.bind<MatchController>('MatchController').to(MatchController).inSingletonScope();

export { container };
