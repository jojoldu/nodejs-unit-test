import { throwSyncError } from './throwError';

export class CatchService {
  catchSync(id: number) {
    try {
      throwSyncError(id);
    } catch (e) {
      console.log()
    }
  }

}
