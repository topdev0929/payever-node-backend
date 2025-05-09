cube('checkout', {
  dimensions: {
    channel: {
      sql: `${CUBE}.channel`,
      type: 'string',
    },
    country: {
      sql: `${CUBE}.\`billingAddress.country\``,
      type: 'string',
    },
    currency: {
      sql: `${CUBE}.currency`,
      type: 'string',
    },
    paymentMethod: {
      sql: `${CUBE}.paymentMethod`,
      type: 'string',
    },
    businessId: {
      sql: `${CUBE}.businessId`,
      type: `string`
    },
    businessName: {
      sql: `${CUBE}.businessName`,
      type: `string`
    },
    createdAt: {
      sql: `${CUBE}.createdAt`,
      type: `string`
    },
    browser: {
      sql: `${CUBE}.browser`,
      type: `string`
    },
    device: {
      sql: `${CUBE}.device`,
      type: `string`
    },
    status: {
      sql: `${CUBE}.status`,
      type: 'string',
    },
  },
  measures: {
    countNewPayments: {
      filters: [{ sql: `${CUBE}.status = 'STATUS_NEW'` }],
      sql: `_id`,
      type: 'count',
    },
    countSuccessPayments: {
      filters: [{ sql: `${CUBE}.status in ('STATUS_ACCEPTED', 'STATUS_PAID')` }],
      sql: `_id`,
      type: 'count',
    },
    totalCountFake: {
      sql: 'count(*)',
      type: 'number',
    },
    totalCount: {
      sql: '_id',
      type: 'count',
    },
    conversionRate: {
      format: 'percent',
      sql: `TRUNCATE(${countSuccessPayments} / ${totalCount} * 100, 2)`,
      type: 'number',
    },
    conversionRateFake: {
      format: 'percent',
      sql: `TRUNCATE(${countSuccessPayments} / ${totalCountFake} * 100, 2)`,
      type: 'number',
    },
    countSessions: {
      filters: [{ sql: `${CUBE}.paymentFlowId is not null` }],
      sql: `_id`,
      type: 'countDistinct',
    },
    exitRate: {
      format: 'percent',
      sql: `TRUNCATE(${countNewPayments} / ${countSuccessPayments} * 100, 2)`,
      type: 'number',
    },
    sessionDuration: {
      sql: `${CUBE}.updatedAt - ${CUBE}.createdAt`,
      type: 'number',
    }
  },
  sql: 'SELECT *, null as paymentFlowId FROM payments',
  preAggregations: {
    payMethodByBus: {
      type: `rollup`,
      dimensionReferences: [status, paymentMethod, businessId],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    chanByBus: {
      type: `rollup`,
      dimensionReferences: [status, channel, businessId],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    payMethodByBusH: {
      type: `rollup`,
      dimensionReferences: [status, paymentMethod, businessId],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    chanByBusH: {
      type: `rollup`,
      dimensionReferences: [status, channel, businessId],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    payMethodByBusY: {
      type: `rollup`,
      dimensionReferences: [status, paymentMethod, businessId],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    chanByBusY: {
      type: `rollup`,
      dimensionReferences: [status, channel, businessId],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    convRateByBusD: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, paymentMethod, businessId, currency],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    convRateByBusH: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, paymentMethod, businessId, currency],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    convRateByBusY: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, paymentMethod, businessId, currency],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exitRevCurBusD: {
      type: `rollup`,
      measureReferences: [exitRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exitRevCurBusH: {
      type: `rollup`,
      measureReferences: [exitRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exitRevCurBusY: {
      type: `rollup`,
      measureReferences: [exitRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exitConvCurBusH: {
      type: `rollup`,
      measureReferences: [exitRate, conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exitConvCurBusD: {
      type: `rollup`,
      measureReferences: [exitRate, conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exitConvCurBusY: {
      type: `rollup`,
      measureReferences: [exitRate, conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    payMetByBusWDB: {
      type: `rollup`,
      dimensionReferences: [status, paymentMethod, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    chanlByBusWDB: {
      type: `rollup`,
      dimensionReferences: [status, channel, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    payMetBHWDB: {
      type: `rollup`,
      dimensionReferences: [status, paymentMethod, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    chanlBusHWDB: {
      type: `rollup`,
      dimensionReferences: [status, channel, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    payMetBusYWDB: {
      type: `rollup`,
      dimensionReferences: [status, paymentMethod, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    chanlBusYWDB: {
      type: `rollup`,
      dimensionReferences: [status, channel, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    convRBusDWDB: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, paymentMethod, businessId, currency, device, browser],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    convRBusHWDB: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, paymentMethod, businessId, currency, device, browser],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    convRBusYWDB: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, paymentMethod, businessId, currency, device, browser],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exRevCurBDWDB: {
      type: `rollup`,
      measureReferences: [exitRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exRevCurBHWDB: {
      type: `rollup`,
      measureReferences: [exitRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exRevCurBYWDB: {
      type: `rollup`,
      measureReferences: [exitRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exConvCurBHWDB: {
      type: `rollup`,
      measureReferences: [exitRate, conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `hour`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exConvCurBDWDB: {
      type: `rollup`,
      measureReferences: [exitRate, conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    exConvCurBYWDB: {
      type: `rollup`,
      measureReferences: [exitRate, conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, currency, businessId, device, browser],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    conversionChanBY: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, channel, businessId],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    conversionChanBM: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, channel, businessId],
      timeDimensionReference: createdAt,
      granularity: `month`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    conversionChanBD: {
      type: `rollup`,
      measureReferences: [conversionRate, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, channel, businessId],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    countSessionsBD: {
      type: `rollup`,
      measureReferences: [countSessions, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, businessId],
      timeDimensionReference: createdAt,
      granularity: `day`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    countSessionsBM: {
      type: `rollup`,
      measureReferences: [countSessions, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, businessId],
      timeDimensionReference: createdAt,
      granularity: `month`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
    countSessionsBY: {
      type: `rollup`,
      measureReferences: [countSessions, countNewPayments, totalCount, countSuccessPayments],
      dimensionReferences: [status, businessId],
      timeDimensionReference: createdAt,
      granularity: `year`,
      external: true,
      scheduledRefresh: true,
      refreshKey: {
        sql: 'SELECT MAX(createdAt) FROM payments',
      },
      useOriginalSqlPreAggregations: true,
    },
  },
});
