export const widgetsPropsFixture: any[] = [
   {
        "_id" : "72db39f7-887b-4028-a33d-67bb1240354d",
        "widgetType" : "transactions",
        "props" : [ 
            {
                "name" : "paymentMethods",
                "query" : {
                    "dimensions" : [ 
                        "transactions.paymentMethod"
                    ],
                    "timeDimensions" : [ 
                        {
                            "dimension" : "transactions.createdAt",
                            "granularity": "year"
                        }
                    ],
                    "filters" : [ 
                        {
                            "member" : "transactions.businessId",
                            "operator" : "equals",
                            "values" : [ 
                                "<BUSINESS_ID>"
                            ]
                        }
                    ]
                }
            },
            {
                "name" : "channels",
                "query" : {
                    "dimensions" : [ 
                        "transactions.channel"
                    ],
                    "timeDimensions" : [ 
                        {
                            "dimension" : "transactions.createdAt",
                            "granularity" : "year"
                        }
                    ],
                    "filters" : [ 
                        {
                            "member" : "transactions.businessId",
                            "operator" : "equals",
                            "values" : [ 
                                "<BUSINESS_ID>"
                            ]
                        }
                    ]
                }
            }
        ]
    },
    {
         "_id" : "72db39f7-887b-4028-a33d-67bb1240354e",
         "widgetType" : "cheeckout",
         "props" : [ 
             {
                 "name" : "paymentMethods",
                 "query" : {
                     "dimensions" : [ 
                         "cheeckout.paymentMethod"
                     ],
                     "timeDimensions" : [ 
                         {
                             "dimension" : "cheeckout.createdAt",
                             "granularity": "year"
                         }
                     ],
                     "filters" : [ 
                         {
                             "member" : "cheeckout.businessId",
                             "operator" : "equals",
                             "values" : [ 
                                 "<BUSINESS_ID>"
                             ]
                         }
                     ]
                 }
             },
             {
                 "name" : "channels",
                 "query" : {
                     "dimensions" : [ 
                         "cheeckout.channel"
                     ],
                     "timeDimensions" : [ 
                         {
                             "dimension" : "cheeckout.createdAt",
                             "granularity" : "year"
                         }
                     ],
                     "filters" : [ 
                         {
                             "member" : "cheeckout.businessId",
                             "operator" : "equals",
                             "values" : [ 
                                 "<BUSINESS_ID>"
                             ]
                         }
                     ]
                 }
             }
         ]
     }
];