export {}

/**
 * 全局类型
 */
declare global {
  type Indexer<T> = {
    [k: string]: T
  }
}
