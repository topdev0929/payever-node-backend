export enum MessageBusChannelsEnum {
  blog = 'async_events_blog_micro',
}

export enum BlogRabbitEnum {
  BlogCreated = 'blog.event.blog.created',
  BlogUpdated = 'blog.event.blog.updated',
  BlogRemoved = 'blog.event.blog.removed',
  BlogExported = 'blog.event.blog.export',
  ElasticSingleIndex = 'elastic.single.index',
  ElasticDeleteByQuery = 'elastic.delete.by.query',

  BlogPageCreated = 'blog.event.blog.page.created',
  BlogPageUpdated = 'blog.event.blog.page.updated',
  BlogPageRemoved = 'blog.event.blog.page.removed',
}
