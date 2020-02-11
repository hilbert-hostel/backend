import { Dependencies } from './container'

export type Service<T> = (deps: Dependencies) => T
