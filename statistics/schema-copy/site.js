cube(`site`, {
  sql: `SELECT * FROM siteevents`,

  dimensions: {
    businessId: {
      sql: `${CUBE}.businessId`,
      type: 'string',
    },
    applicationId: {
      sql: `${CUBE}.applicationId`,
      type: 'string',
    },
    url: {
      sql: `${CUBE}.url`,
      type: 'string',
    },
    element: {
      sql: `${CUBE}.element`,
      type: 'string',
    },
    clientId: {
      sql: `${CUBE}.clientId`,
      type: 'string',
    },
    type: {
      sql: `${CUBE}.type`,
      type: 'string',
    },
    createdAt: {
      sql: `${CUBE}.createdAt`,
      type: `string`
    },
  },

  measures: {
    uniqueVisitorsOfPage: {
      sql: `${CUBE}.clientId`,
      type: 'countDistinct',
      filters: [{ sql: `${CUBE}.url = '${SECURITY_CONTEXT.url.unsafeValue()}'` }, { sql: `${CUBE}.type = 'PAGE_VIEW'` }]
    },
    totalUniqueVisitors: {
      sql: `${CUBE}.clientId`,
      type: 'countDistinct',
      filters: [{ sql: `${CUBE}.type = 'PAGE_VIEW'` }]
    },
    bounceRate: {
      format: 'percent',
      sql: `TRUNCATE(${uniqueVisitorsOfPage} / ${totalUniqueVisitors} * 100, 2)`,
      type: 'number',
    },
    clickRateOfElementAmongVisitors: {
      format: 'percent',
      sql: `TRUNCATE(${totalCountOfElementClicks} / ${totalUniqueVisitors} * 100, 2)`,
      type: 'number',
    },
    clickRateAmongVisitors: {
      format: 'percent',
      sql: `TRUNCATE(${totalCountOfAllClicks} / ${totalUniqueVisitors} * 100, 2)`,
      type: 'number',
    },
    clickRateAmongClicks: {
      format: 'percent',
      sql: `TRUNCATE(${totalCountOfElementClicks} / ${totalCountOfAllClicks} * 100, 2)`,
      type: 'number',
    },
    totalCountOfElementClicks: {
      sql: `${CUBE}.clientId`,
      type: 'countDistinct',
      filters: [{ sql: `${CUBE}.element = '${SECURITY_CONTEXT.element.unsafeValue()}'` }, { sql: `${CUBE}.type = 'CLICK'` }]
    },
    totalCountOfAllClicks: {
      sql: `concat(${CUBE}.clientId, ${CUBE}.element)`,
      type: 'countDistinct',
      filters: [{ sql: `${CUBE}.type = 'CLICK'` }]
    },
    ecomRateOfProductAmongVisitors: {
      format: 'percent',
      sql: `TRUNCATE(${totalCountOfProductEcoms} / ${totalUniqueVisitors} * 100, 2)`,
      type: 'number',
    },
    ecomRateAmongVisitors: {
      format: 'percent',
      sql: `TRUNCATE(${totalCountOfAllEcoms} / ${totalUniqueVisitors} * 100, 2)`,
      type: 'number',
    },
    ecomRateOfProduct: {
      format: 'percent',
      sql: `TRUNCATE(${totalCountOfProductEcoms} / ${totalCountOfAllEcoms} * 100, 2)`,
      type: 'number',
    },
    totalCountOfProductEcoms: {
      sql: `${CUBE}.clientId`,
      type: 'countDistinct',
      filters: [{ sql: `${CUBE}.element = '${SECURITY_CONTEXT.element.unsafeValue()}'` }, { sql: `${CUBE}.type = 'ECOM'` }]
    },
    totalCountOfAllEcoms: {
      sql: `concat(${CUBE}.clientId, ${CUBE}.element)`,
      type: 'countDistinct',
      filters: [{ sql: `${CUBE}.type = 'ECOM'` }]
    },
  },
  preAggregations: {
    hourly: {
      type: `rollup`,
      measureReferences: [totalUniqueVisitors, totalCountOfAllClicks, totalCountOfAllEcoms, ecomRateAmongVisitors, clickRateAmongVisitors],
      dimensionReferences: [businessId, applicationId, type],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM siteevents',
      },
      useOriginalSqlPreAggregations: true,
    },
    daily: {
      type: `rollup`,
      measureReferences: [totalUniqueVisitors, totalCountOfAllClicks, totalCountOfAllEcoms, ecomRateAmongVisitors, clickRateAmongVisitors],
      dimensionReferences: [businessId, applicationId, type],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM siteevents',
      },
      useOriginalSqlPreAggregations: true,
    },
    monthly: {
      type: `rollup`,
      measureReferences: [totalUniqueVisitors, totalCountOfAllClicks, totalCountOfAllEcoms, ecomRateAmongVisitors, clickRateAmongVisitors],
      dimensionReferences: [businessId, applicationId, type],
      timeDimensionReference: createdAt,
      granularity: `month`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM siteevents',
      },
      useOriginalSqlPreAggregations: true,
    },
    yearly: {
      type: `rollup`,
      measureReferences: [totalUniqueVisitors, totalCountOfAllClicks, totalCountOfAllEcoms, ecomRateAmongVisitors, clickRateAmongVisitors],
      dimensionReferences: [businessId, applicationId, type],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM siteevents',
      },
      useOriginalSqlPreAggregations: true,
    },
  }
})
