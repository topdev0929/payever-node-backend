# Studio

jiraKey: STM

## Media, Attributes and Album

Studio service have 2 type of medias based on its file type image and video. On the other hand, medias can be divided into two types based on the owner. First is subscription media and the other one is user media.

### Subscription Media

Subscription media is media that uploaded by payever admin. Currently all subscription media will be free for subscription. Means that every user can use these medias. In the future we will implement multiple level of subscription.

### User Media

User media is media that uploaded by user. User can use it across multiple business that they have.

### Attributes

Attribute is dynamic information for medias. 
For example we have 3 types of attribute:
```
{
    "_id": "3d15c34c-759d-4608-8a3d-0b01e37083fb",
    "icon": "http://test.com/icon.jpg",
    "name": "Has People",
    "type": "people"
}
```
```
{
    "_id": "6655622f-42b6-4c71-b3c7-167daf224a00",
    "icon": "http://test.com/icon.jpg",
    "name": "Orientation",
    "type": "orientation"
}
```
```
{
    "_id": "50f3da1b-72c9-4d13-aaf9-09295f3dc4f9",
    "icon": "http://test.com/icon.jpg",
    "name": "car",
    "type": "vehicle"
}
```

Then we can implement it in medias like:
```
{
    "_id": "d6a1c2e1-5c5f-4715-965c-88734e625770",
    "url": "https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,q_auto:best,w_640/v1597748711/a7lrogt8fcp6bokuvbcy.jpg",
    "attributes": [{
        "attribute": "50f3da1b-72c9-4d13-aaf9-09295f3dc4f9",
        "value": "McLaren"
    }, {
        "attribute": "6655622f-42b6-4c71-b3c7-167daf224a00",
        "value": "Landscape"
    }, {
        "attribute": "3d15c34c-759d-4608-8a3d-0b01e37083fb",
        "value": "true"
    }],
    "mediaType": "image",
    "name": "Drift",
    "subscriptionType": 0
}
```
In this case, the implementation of 3 attributes are different with each other.
* Attribute `People - Has People` implemented in medias using __string__ value `true` and `false` 
* Attribute `orientation - Orientation` implemented in medias using __string__ value `Landscape` and `Portrait`
* Attribute `Vehicle - Car` implemented in medias using __string__ with value brand of car `McLaren`, `Ford`, `Dodge`, etc. 

### Album
Album is folder like where user can create to put their medias. User can create album inside an album. For example user create album `2020` and then create others albums `January`, `February`, `March` inside the `2020` album. Then they can link their media to this album.

***

## API

### Subscription Media

#### Create subscription media 
Role: admin

Parameters:
- url: url media
- mediaType: image, video
- subscriptionType (optional default free): free, essential, premium, pro
- name
- attributes: object of attribute (optional)
    * attributeId: attribute id
    * value: the value of attribute

Request: POST

Url: `http://localhost:3000/api/subscription`

Body:
```
{
	"url":"{url}",
	"mediaType": "{mediaType}",
	"subscriptionType": "{subscriptionType}",
	"name": "{name}",
	"attributes":  [
        {
            "attribute": "{attributeId}",
            "value": "{value}"
        }
    ]
}
```

Response:
```
{
  "_id": "b9d21702-b999-46f2-843f-6801d5bad6f3",
  "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
  "__v": 0,
  "createdAt": "2020-06-26T07:23:37.565Z",
  "mediaType": "image",
  "name": "name1",
  "attributes": [
    {
      "attribute": {
        "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
        "name": "black",
        "type": "color"
      },
      "value": "test"
    }
  ],
  "subscriptionType": 0,
  "updatedAt": "2020-06-26T07:23:58.363Z"
}
```

#### Get subscription media by id
Role: admin

Parameters:
- mediaId: ID of the media

Request: GET

Url: `http://localhost:3000/api/subscription/{mediaId}`

Response:
```
{
  "_id": "b9d21702-b999-46f2-843f-6801d5bad6f3",
  "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
  "__v": 0,
  "createdAt": "2020-06-26T07:23:37.565Z",
  "mediaType": "image",
  "mediaInfo": {
    "dimension": "1280 x 640",
    "size": "878.38 KB",
    "type": "video/mp4"
  },
  "name": "name1",
  "attributes": [
    {
      "attribute": {
        "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
        "name": "black",
        "type": "color"
      },
      "value": "test"
    }
  ],
  "subscriptionType": 0,
  "updatedAt": "2020-06-26T07:23:58.363Z"
}
```

#### Get all subscription media
Role: admin

Parameters:
- page (optional): page
- limit (optional): limit per page
- asc or desc sortable fields (optional): including updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/subscription?limit={limit}&page={page}&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "b9d21702-b999-46f2-843f-6801d5bad6f3",
    "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
    "__v": 0,
    "createdAt": "2020-06-26T07:23:37.565Z",
    "mediaType": "image",
    "mediaInfo": {
      "dimension": "1280 x 640",
      "size": "878.38 KB",
      "type": "video/mp4"
    },
    "name": "name1",
    "attributes": [
      {
        "attribute": {
          "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
          "name": "black",
          "type": "color"
        },
        "value": "test"
      }
    ],
    "subscriptionType": 0,
    "updatedAt": "2020-06-26T07:23:58.363Z"
  }
]
```

#### Get subscription media by type
Role: admin

Parameters:
- page (optional): page
- limit (optional): limit per page
- subscriptionType: free, essential, premium, pro
- asc or desc sortable fields (optional): including updatedAt, createdAt, and other thing that listed on the response below

Request: Get

Url: `http://localhost:3000/api/subscription/type/{subscriptionType}?limit=2&page=1&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "b9d21702-b999-46f2-843f-6801d5bad6f3",
    "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
    "__v": 0,
    "createdAt": "2020-06-26T07:23:37.565Z",
    "mediaType": "image",
    "mediaInfo": {
      "dimension": "1280 x 640",
      "size": "878.38 KB",
      "type": "video/mp4"
    },
    "name": "name1",
    "attributes": [
      {
        "attribute": {
          "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
          "name": "black",
          "type": "color"
        },
        "value": "test"
      }
    ],
    "subscriptionType": 0,
    "updatedAt": "2020-06-26T07:23:58.363Z"
  }
]
```

#### Get subscription media by attribute
Role: admin

Parameters:
- page (optional): page
- limit (optional): limit per page
- attributeId: the id of attribute
- attributeValue: the value of attribute
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: Get

Url: `http://localhost:3000/api/subscription/attribute/{attributeId}/{attributeValue}?limit={limit}&page={page}&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "b9d21702-b999-46f2-843f-6801d5bad6f3",
    "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
    "__v": 0,
    "createdAt": "2020-06-26T07:23:37.565Z",
    "mediaType": "image",
    "mediaInfo": {
      "dimension": "1280 x 640",
      "size": "878.38 KB",
      "type": "video/mp4"
    },
    "name": "name1",
    "attributes": [
      {
        "attribute": {
          "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
          "name": "black",
          "type": "color"
        },
        "value": "test"
      }
    ],
    "subscriptionType": 0,
    "updatedAt": "2020-06-26T07:23:58.363Z"
  }
]
```

#### Get subscription media by multiple attribute
Role: admin

Parameters:
- page (optional): page
- limit (optional): limit per page
- attributeId: the id of attribute
- attributeValue: the value of attribute
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: Post

Url: `http://localhost:3000/api/subscription/by-attribute?limit={limit}&page={page}&asc=name&desc=updatedAt&asc=url`

Body:
```
{
	"attributes":  [
    {
      "attribute": "{attributeId}",
      "value": "{value}"
    },
    {
      "attribute": "{attributeId}",
      "value": "{value}"
    }
  ]
}
```

Response:
```
[
  {
    "_id": "b9d21702-b999-46f2-843f-6801d5bad6f3",
    "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
    "__v": 0,
    "createdAt": "2020-06-26T07:23:37.565Z",
    "mediaType": "image",
    "name": "name1",
    "attributes": [
      {
        "attribute": {
          "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
          "name": "black",
          "type": "color"
        },
        "value": "test"
      }
    ],
    "subscriptionType": 0,
    "updatedAt": "2020-06-26T07:23:58.363Z"
  }
]
```

#### Search subscription media for admin
Role: admin

Parameters:
- page (optional): page
- limit (optional): limit per page
- name: search subscription media name

Request: Get

Url: `http://localhost:3000/api/subscription/search?limit=3&page=1&name={name}`

Response:
```
[
  {
    "_id": "b9d21702-b999-46f2-843f-6801d5bad6f3",
    "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
    "__v": 0,
    "createdAt": "2020-06-26T07:23:37.565Z",
    "mediaType": "image",
    "mediaInfo": {
      "dimension": "1280 x 640",
      "size": "878.38 KB",
      "type": "video/mp4"
    },
    "name": "name1",
    "attributes": [
      {
        "attribute": {
          "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
          "name": "black",
          "type": "color"
        },
        "value": "test"
      }
    ],
    "subscriptionType": 0,
    "updatedAt": "2020-06-26T07:23:58.363Z"
  }
]
```

#### Delete subscription media by id
Role: admin

Parameters:
- mediaId: Id of media

Request: DELETE

Url: `http://localhost:3000/api/subscription/{mediaId}`

### Attribute

#### Create Attribute
Role: admin

Parameters:
- iconUrl: icon url of attribute
- attributeName: name of the attribute
- attributeType: type of attribute

Request: POST

Url: `http://localhost:3000/api/attribute`

Body: 
```
{
    "icon": "{iconUrl}",
	"name": "{attributeName}",
	"type": "{attributeType}"
}
```

Response:
```
{
  "_id": "eda7ceab-63b2-449c-bd9b-63e233f60d51",
  "icon": "http://test.com/icon.jpg",
  "name": "car",
  "type": "vehicle",
  "createdAt": "2020-07-08T13:56:47.495Z",
  "updatedAt": "2020-07-08T13:56:47.495Z",
  "__v": 0
}
```

#### Update Attribute
Role: admin

Parameters:
- attributeId: id of the attribute
- iconUrl: icon url of attribute
- attributeName: name of the attribute
- attributeType: type of attribute

Request: PATCH

Url: `http://localhost:3000/api/attribute/{attributeId}`

Body: 
```
{
    "icon": "{iconUrl}",
	"name": "{attributeName}",
	"type": "{attributeType}"
}
```

Response:
```
{
  "_id": "eda7ceab-63b2-449c-bd9b-63e233f60d51",
  "icon": "http://test.com/icon.jpg",
  "name": "car",
  "type": "vehicle",
  "createdAt": "2020-07-08T13:56:47.495Z",
  "updatedAt": "2020-07-08T13:56:47.495Z",
  "__v": 0
}
```

#### Get All Attribute
Role: merchant

Parameters:
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/attribute?page=1&limit=1&asc=name&desc=updatedAt&asc=type`

Response:
```
[
  {
    "_id": "2fdb9425-94ac-4b86-b4ff-5582914a25d5",
    "icon": "http://test.com/icon.jpg",
    "name": "white",
    "type": "color",
    "createdAt": "2020-07-08T13:54:31.722Z",
    "updatedAt": "2020-07-08T13:54:31.722Z",
    "__v": 0
  }
]
```

#### Get Type Attribute
Role: merchant

Request: GET

Url: `http://localhost:3000/api/attribute/type`

Response:
```
[
  "people",
  "color",
  "orientation",
  "vehicle"
]
```

#### Get All Attribute by Type
Role: merchant

Parameters:
- type: type of attributes
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/attribute/type/{type}?page=1&limit=1&asc=name&desc=updatedAt&asc=type`

Response:
```
[
  {
    "_id": "2fdb9425-94ac-4b86-b4ff-5582914a25d5",
    "icon": "http://test.com/icon.jpg",
    "name": "white",
    "type": "color",
    "createdAt": "2020-07-08T13:54:31.722Z",
    "updatedAt": "2020-07-08T13:54:31.722Z",
    "__v": 0
  }
]
```

#### Get Attribute By Id
Role: merchant

Parameters:
- attributeId

Request: GET

Url: `http://localhost:3000/api/attribute/{attributeId}`

Response:
```
{
  "_id": "eda7ceab-63b2-449c-bd9b-63e233f60d51",
  "icon": "http://test.com/icon.jpg",
  "name": "white",
  "type": "color",
  "createdAt": "2020-07-08T13:56:47.495Z",
  "updatedAt": "2020-07-08T16:22:08.050Z",
  "__v": 0
}
```

#### Delete Attribute By Id
Role: admin

Parameters:
- attributeId

Request: DELETE

Url: `http://localhost:3000/api/attribute/{attributeId}`

Response: 200

### User media

#### Create user media
Role: merchant

Parameters:
- businessId: Id of user business
- mediaUrl: url of media
- mediaType: image, video
- name (optional)
- albumId (optional)
- attributes: object of attribute (optional)
    * attributeId: attribute id
    * value: the value of attribute
- userAttributes: object of attribute (optional)
    * attributeId: attribute id
    * value: the value of attribute
- userAttributeGroups: Ids of attribute group to be implemented  (optional)

Request: POST

Url: `http://localhost:3000/api/{businessId}/media`

Body:
```
{
  "url": "{mediaUrl}",
  "mediaType": "{mediaType}",
  "name": "{name}",
  "businessId": "{businessId}",
  "attributes": [
    {
      "attribute": "{attributeId}",
      "value": "{value}"
    }
  ],
  "albumId": "{albumId}",
  "userAttributes": [
    {
      "attribute": "{attributeId}",
      "value": "{value}"
    }
  ],
  "userAttributeGroups": [
    "{userAttributeGroupsIds}"
  ]
}
```

Response:
```
{
  "_id": "d235ee78-e601-4082-8033-4e9d508faaf7",
  "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
  "url": "https://blue.kumparan.com/uikit-assets/assets/logos/kumparan-c19-9584616948eba09a2614275dfe8f7c47-2.png",
  "__v": 0,
  "createdAt": "2020-06-30T08:01:11.282Z",
  "mediaType": "image",
  "name": "blue kum 2",
  "album": "b62e78dc-91ec-4db8-a3b4-f651192a4f27"
  "updatedAt": "2020-07-01T06:06:28.399Z",
  "attributes": [
    {
      "attribute": {
        "_id": "1d1c4bdd-980c-410f-896f-49b88b48ef4c",
        "icon": "http://test.com/icon.jpg",
        "name": "car",
        "type": "vehicle"
      },
      "value": "ford"
    }
  ],
  "userAttributes": [
    {
      "attribute": {
        "_id": "417128cd-6c07-4b56-8430-b94db8a9563b",
        "icon": "http://test.com",
        "name": "ship 2",
        "type": "vehicle"
      },
      "value": "ford2"
    }
  ]
}
```

#### Get User Media
Role: merchant

Parameters:
- businessId
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/{BusinessId}/media?page={page}&limit={limit}&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "d235ee78-e601-4082-8033-4e9d508faaf7",
    "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
    "url": "https://blue.kumparan.com/uikit-assets/assets/logos/kumparan-c19-9584616948eba09a2614275dfe8f7c47-2.png",
    "__v": 0,
    "createdAt": "2020-06-30T08:01:11.282Z",
    "mediaType": "image",
    "mediaInfo": {
      "dimension": "1280 x 640",
      "size": "878.38 KB",
      "type": "video/mp4"
    },
    "name": "blue kum 2",
    "album": "b62e78dc-91ec-4db8-a3b4-f651192a4f27",
    "updatedAt": "2020-07-01T06:06:28.399Z",
    "attributes": [
      {
        "attribute": {
          "_id": "1d1c4bdd-980c-410f-896f-49b88b48ef4c",
          "icon": "http://test.com/icon.jpg",
          "name": "car",
          "type": "vehicle"
        },
        "value": "ford"
      }
    ],
    "userAttributes": [
      {
        "attribute": {
          "_id": "417128cd-6c07-4b56-8430-b94db8a9563b",
          "icon": "http://test.com",
          "name": "ship 2",
          "type": "vehicle"
        },
        "value": "ford2"
      }
    ]
  }
]
```

#### Get user media by id
Role: merchant

Parameters:
- businessId
- mediaId

Request: GET

Url: `http://localhost:3000/api/{businessId}/media/{mediaId}`

Response:
```
{
  "_id": "d235ee78-e601-4082-8033-4e9d508faaf7",
  "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
  "url": "https://blue.kumparan.com/uikit-assets/assets/logos/kumparan-c19-9584616948eba09a2614275dfe8f7c47-2.png",
  "__v": 0,
  "createdAt": "2020-06-30T08:01:11.282Z",
  "mediaType": "image",
  "mediaInfo": {
    "dimension": "1280 x 640",
    "size": "878.38 KB",
    "type": "video/mp4"
  },
  "name": "blue kum 2",
  "album": "b62e78dc-91ec-4db8-a3b4-f651192a4f27",
  "updatedAt": "2020-07-01T06:06:28.399Z",
  "attributes": [
    {
      "attribute": {
        "_id": "1d1c4bdd-980c-410f-896f-49b88b48ef4c",
        "icon": "http://test.com/icon.jpg",
        "name": "car",
        "type": "vehicle"
      },
      "value": "ford"
    }
  ],
  "userAttributes": [
    {
      "attribute": {
        "_id": "417128cd-6c07-4b56-8430-b94db8a9563b",
        "icon": "http://test.com",
        "name": "ship 2",
        "type": "vehicle"
      },
      "value": "ford2"
    }
  ]
}
```

#### Delete user media
Role: merchant

Parameters:
- businessId
- mediaId

Request: DELETE
Url `http://localhost:3000/api/{businessId}/media/{mediaId}`

#### Delete many user media
Role: merchant

Parameters:
- businessId
- mediaIds: array of user media id that will be deleted

Request: DELETE
Url `http://localhost:3000/api/{businessId}/medias/delete`

Body: 
```
{
	"ids": [{mediaIds}]
}
```

#### Search user media
Role: merchant

Parameters:
- businessId
- page (optional)
- limit (optional)
- name: search name
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET
URL `http://localhost:3000/api/{businessId}/media/search?page={page}&limit={limit}&name={name}&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "d235ee78-e601-4082-8033-4e9d508faaf7",
    "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
    "url": "https://blue.kumparan.com/uikit-assets/assets/logos/kumparan-c19-9584616948eba09a2614275dfe8f7c47-2.png",
    "__v": 0,
    "createdAt": "2020-06-30T08:01:11.282Z",
    "mediaType": "image",
    "mediaInfo": {
        "dimension": "1280 x 640",
        "size": "878.38 KB",
        "type": "video/mp4"
    },
    "name": "blue kum 2",
    "updatedAt": "2020-07-01T06:06:28.399Z",
    "attributes": [
      {
        "attribute": {
          "_id": "1d1c4bdd-980c-410f-896f-49b88b48ef4c",
          "icon": "http://test.com/icon.jpg",
          "name": "car",
          "type": "vehicle"
        },
        "value": "ford"
      }
    ],
    "userAttributes": [
      {
        "attribute": {
          "_id": "417128cd-6c07-4b56-8430-b94db8a9563b",
          "icon": "http://test.com",
          "name": "ship 2",
          "type": "vehicle"
        },
        "value": "ford2"
      }
    ]
  }
]
```

#### Get user media by album
Role: merchant

Parameters:
- businessId
- page (optional)
- limit (optional)
- userAlbumId
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET
URL `http://localhost:3000/api/{businessId}/media/album/{userAlbumId}?page={page}&limit={limit}&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "d235ee78-e601-4082-8033-4e9d508faaf7",
    "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
    "url": "https://blue.kumparan.com/uikit-assets/assets/logos/kumparan-c19-9584616948eba09a2614275dfe8f7c47-2.png",
    "__v": 0,
    "album": "{userAlbumId}",
    "createdAt": "2020-06-30T08:01:11.282Z",
    "mediaType": "image",
    "mediaInfo": {
        "dimension": "1280 x 640",
        "size": "878.38 KB",
        "type": "video/mp4"
    },
    "name": "blue kum 2",
    "updatedAt": "2020-07-01T06:06:28.399Z",
    "attributes": [
      {
        "attribute": {
          "_id": "1d1c4bdd-980c-410f-896f-49b88b48ef4c",
          "icon": "http://test.com/icon.jpg",
          "name": "car",
          "type": "vehicle"
        },
        "value": "ford"
      }
    ],
    "userAttributes": [
      {
        "attribute": {
          "_id": "417128cd-6c07-4b56-8430-b94db8a9563b",
          "icon": "http://test.com",
          "name": "ship 2",
          "type": "vehicle"
        },
        "value": "ford2"
      }
    ]
  }
]
```

#### Get user media by user attribute
Role: merchant

Parameters:
- businessId
- page (optional): page
- limit (optional): limit per page
- attributeId: the id of attribute
- attributeValue: the value of attribute
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: Get

Url: `http://localhost:3000/api/{businessId}/media/by-user-attribute/{attributeId}/{attributeValue}?limit={limit}&page={page}&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "userAttributes": [
      {
        "attribute": "534321e7-1d3a-4292-bdd1-f1f497323dd1",
        "value": "800x400"
      }
    ],
    "_id": "bce917ed-9b01-49eb-b517-29be7e273fc1",
    "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
    "url": "https://payevertesting.blob.core.windows.net/miscellaneous/6f338b22-9053-49e4-b08f-3cd7b97a687a-eci3.jpg",
    "mediaType": "image",
    "name": "eci 3",
    "attributes": [],
    "createdAt": "2020-09-17T12:53:40.535Z",
    "updatedAt": "2020-09-17T14:42:32.013Z",
    "__v": 0,
    "album": null
  }
]
```

#### Get user media by multiple user attribute
Role: merchant

Parameters:
- businessId
- page (optional): page
- limit (optional): limit per page
- attributeId: the id of attribute
- attributeValue: the value of attribute
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: Post

Url: `http://localhost:3000/api/{businessId}/media/by-user-attribute?limit={limit}&page={page}&asc=name&desc=updatedAt&asc=url`

Body:
```
{
	"attributes": [
		{
			"attribute": "{attributeId}",
			"value": "{value}"
		},
		{
			"attribute": "{attributeId}",
			"value": "{value}"
		}
	]
}
```

Response:
```
[
  {
    "userAttributes": [
      {
        "attribute": "beddbd7a-164f-4551-a44a-d532e25b615e",
        "value": "true"
      },
      {
        "attribute": "a192e5b9-2bc2-4a44-bdfd-273796b31a68",
        "value": "720p"
      }
    ],
    "_id": "bce917ed-9b01-49eb-b517-29be7e273fc1",
    "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
    "url": "https://payevertesting.blob.core.windows.net/miscellaneous/6f338b22-9053-49e4-b08f-3cd7b97a687a-eci3.jpg",
    "mediaType": "image",
    "name": "eci 3",
    "attributes": [],
    "createdAt": "2020-09-17T12:53:40.535Z",
    "updatedAt": "2020-09-17T14:42:32.013Z",
    "__v": 0,
    "album": null
  }
]
```

### User Attribute

#### Create User Attribute
Role: merchant

Parameters:
- businessId
- iconUrl: icon url of attribute
- attributeName: name of the attribute
- attributeType: type of attribute
- filterable: boolean
- onlyAdmin: boolean
- showOn: one of `all` `media` or `album`
- defaultValue: string
- userAttributeGroupId: userAttributeGroup id 

Request: POST

Url: `http://localhost:3000/api/{businessId}/attribute`

Body: 
```
{
    "businessId": "{businessId}",
    "icon": "{iconUrl}",
	"name": "{attributeName}",
	"type": "{attributeType}",
	"filterAble": true,
	"onlyAdmin": false,
	"showOn": ["all", "media", "album"],
	"defaultValue": "1200x800",
	"userAttributeGroupId": "{userAttributeGroupId}"
}
```

Response:
```
{
  "_id": "a7dd3d0b-0e7b-434e-96fe-5e2260efa1d3",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "icon": "http://test.com/icon.jpg",
  "name": "car",
  "type": "vehicle",
  "defaultValue": "1200x800",
  "userAttributeGroup": "684e2015-6d63-4fa1-aa25-04dbbca160f0",
  "filterAble": true,
  "onlyAdmin": false,
  "showOn": [
    "all"
  ],
  "createdAt": "2020-07-30T12:00:36.503Z",
  "updatedAt": "2020-07-30T12:00:36.503Z",
  "__v": 0
}
```

#### Update User Attribute
Role: merchant

Parameters:
- businessId
- attributeId: id of the attribute
- iconUrl: icon url of attribute
- attributeName: name of the attribute
- attributeType: type of attribute
- filterable: boolean
- onlyAdmin: boolean
- showOn: one of `all` `media` or `album`
- defaultValue: string
- userAttributeGroupId: userAttributeGroup id

Request: PATCH

Url: `http://localhost:3000/api/{businessId}/attribute/{attributeId}`

Body: 
```
{
    "businessId": "{businessId}",
    "icon": "{iconUrl}",
	"name": "{attributeName}",
	"type": "{attributeType}",
	"type": "{attributeType}",
	"filterAble": true,
	"onlyAdmin": false,
	"showOn": ["all", "media", "album"],
	"defaultValue": "1200x800",
	"userAttributeGroupId": "{userAttributeGroupId}"
}
```

Response:
```
{
  "_id": "55a71e66-c7a2-4c32-96e6-f6e3208e7c02",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "icon": "http://test.com",
  "name": "ship 2",
  "type": "vehicle",
  "defaultValue": "1200x800",
  "userAttributeGroup": "684e2015-6d63-4fa1-aa25-04dbbca160f0",
  "filterAble": true,
  "onlyAdmin": false,
  "showOn": [
    "all"
  ],
  "createdAt": "2020-07-30T11:15:59.300Z",
  "updatedAt": "2020-07-30T12:37:16.818Z",
  "__v": 0
}
```

#### Get All User Attribute 
Role: merchant

Parameters:
- businessId
- page (optional)
- limit (optional)

Request: GET

Url: `http://localhost:3000/api/{businessId}/attribute?page=1&limit=1`

Response:
```
[
  {
    "_id": "55a71e66-c7a2-4c32-96e6-f6e3208e7c02",
    "business": "9b601fea-752b-4268-8892-79ff027e038a",
    "icon": "http://test.com/icon.jpg",
    "name": "false",
    "type": "vehicle",
    "defaultValue": "1200x800",
    "userAttributeGroup": "684e2015-6d63-4fa1-aa25-04dbbca160f0",
    "filterAble": true,
    "onlyAdmin": false,
    "showOn": [
        "all"
    ],
    "createdAt": "2020-07-30T11:15:59.300Z",
    "updatedAt": "2020-07-30T11:15:59.300Z",
    "__v": 0
  }
]
```

#### Get Type User Attribute
Role: merchant

Parameters:
- businessId

Request: GET

Url: `http://localhost:3000/api/{businessId}/attribute/type`

Response:
```
[
  "private",
  "dimension",
  "parapraph",
  "dropdown"
]
```

#### Get All User Attribute by Type
Role: merchant

Parameters:
- type: type user attribute
- businessId
- page (optional)
- limit (optional)

Request: GET

Url: `http://localhost:3000/api/{businessId}/attribute/type/{type}?page=1&limit=1`

Response:
```
[
  {
    "_id": "55a71e66-c7a2-4c32-96e6-f6e3208e7c02",
    "business": "9b601fea-752b-4268-8892-79ff027e038a",
    "icon": "http://test.com/icon.jpg",
    "name": "false",
    "type": "vehicle",
    "defaultValue": "1200x800",
    "userAttributeGroup": "684e2015-6d63-4fa1-aa25-04dbbca160f0",
    "filterAble": true,
    "onlyAdmin": false,
    "showOn": [
        "all"
    ],
    "createdAt": "2020-07-30T11:15:59.300Z",
    "updatedAt": "2020-07-30T11:15:59.300Z",
    "__v": 0
  }
]
```

#### Get User Attribute By Id
Role: merchant

Parameters:
- businessId
- attributeId

Request: GET

Url: `http://localhost:3000/api/{businessId}/attribute/{attributeId}`

Response:
```
{
  "_id": "55a71e66-c7a2-4c32-96e6-f6e3208e7c02",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "icon": "http://test.com",
  "name": "ship 2",
  "type": "vehicle",
  "defaultValue": "1200x800",
  "userAttributeGroup": "684e2015-6d63-4fa1-aa25-04dbbca160f0",
  "filterAble": true,
  "onlyAdmin": false,
  "showOn": [
    "all"
  ],
  "createdAt": "2020-07-30T11:15:59.300Z",
  "updatedAt": "2020-07-30T11:24:07.662Z",
  "__v": 0
}
```

#### Delete User Attribute By Id
Role: merchant

Parameters:
- businessId
- attributeId

Request: DELETE

Url: `http://localhost:3000/api/{businessId}/attribute/{attributeId}`

Response: 200

### User Attribute Group

#### Create User Attribute Group
Role: merchant

Parameters:
- businessId
- attributeName: name of the attribute 

Request: POST

Url: `http://localhost:3000/api/{businessId}/attribute/group`

Body: 
```
{
    "businessId": "{businessId}",
	"name": "{attributeName}"
}
```

Response:
```
{
  "_id": "a7dd3d0b-0e7b-434e-96fe-5e2260efa1d3",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "name": "image detail",
  "createdAt": "2020-07-30T12:00:36.503Z",
  "updatedAt": "2020-07-30T12:00:36.503Z",
  "__v": 0
}
```

#### Update Attribute Group
Role: merchant

Parameters:
- businessId
- attributeName: name of the attribute
- attributeGroupId

Request: PATCH

Url: `http://localhost:3000/api/{businessId}/attribute/group/{attributeGroupId}`

Body: 
```
{
    "businessId": "{businessId}",
	"name": "{attributeName}"
}
```

Response:
```
{
  "_id": "55a71e66-c7a2-4c32-96e6-f6e3208e7c02",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "name": "Image detail 2",
  "createdAt": "2020-07-30T11:15:59.300Z",
  "updatedAt": "2020-07-30T12:37:16.818Z",
  "__v": 0
}
```

#### Get All Attribute Group
Role: merchant

Parameters:
- businessId
- page (optional)
- limit (optional)

Request: GET

Url: `http://localhost:3000/api/{businessId}/attribute/group?page=1&limit=1`

Response:
```
[
  {
    "_id": "55a71e66-c7a2-4c32-96e6-f6e3208e7c02",
    "business": "9b601fea-752b-4268-8892-79ff027e038a",
    "name": "false",
    "createdAt": "2020-07-30T11:15:59.300Z",
    "updatedAt": "2020-07-30T11:15:59.300Z",
    "__v": 0
  }
]
```

#### Get Attribute Group By Id
Role: merchant

Parameters:
- businessId
- attributeGroupId

Request: GET

Url: `http://localhost:3000/api/{businessId}/attribute/group/{attributeGroupId}`

Response:
```
{
  "_id": "55a71e66-c7a2-4c32-96e6-f6e3208e7c02",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "name": "ship 2",
  "createdAt": "2020-07-30T11:15:59.300Z",
  "updatedAt": "2020-07-30T11:24:07.662Z",
  "__v": 0
}
```

#### Delete Attribute Group By Id
Role: merchant

Parameters:
- businessId
- attributeGroupId

Request: DELETE

Url: `http://localhost:3000/api/{businessId}/attribute/{attributeGroupId}`

Response: 200  

### Album

#### Create Album
Role: merchant

Parameters:
- businessId
- description (optional)
- iconUrl (optional: icon url of attribute
- attributeName: name of the attribute
- parent (optional): album id of parent
- userAttributes: object of attribute (optional)
    * attributeId: attribute id
    * value: the value of attribute
- userAttributeGroups: Ids of attribute group to be implemented  (optional)

Request: POST

Url: `http://localhost:3000/api/{businessId}/album`

Body: 
```
{
  "businessId": "{businessId}",
  "description": "{description}",
  "icon": "{iconUrl}",
  "name": "{attributeName}",
  "parent": "{parent}",
  "userAttributes": [
    {
      "attribute": "{attributeId}",
      "value": "{value}"
    }
  ],
  "userAttributeGroups": [
    "{userAttributeGroupsIds}"
  ]
}
```

Response:
```
{
  "ancestors": [],
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "name": "January",
  "description": "descrtion goes here",
  "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
  "userAttributes": [
    {
      "attribute": {
        "_id": "417128cd-6c07-4b56-8430-b94db8a9563b",
        "icon": "http://test.com",
        "name": "ship 2",
        "type": "vehicle"
      },
      "value": "ford2"
    }
  ],
  "_id": "e537c35d-bd49-42e0-bfd6-6e6f80ad28c1",
  "createdAt": "2020-07-29T13:40:53.717Z",
  "updatedAt": "2020-07-29T13:40:53.717Z",
  "__v": 0
}
```

#### Update Album
Role: merchant

Parameters:
- albumId
- businessId
- description (optional)
- iconUrl (optional: icon url of attribute
- attributeName: name of the attribute
- parent (optional): album id of parent
- userAttributes: object of attribute (optional)
    * attributeId: attribute id
    * value: the value of attribute
- userAttributeGroups: Ids of attribute group to be implemented  (optional)

Request: PATCH

Url: `http://localhost:3000/api/{businessId}/album/{albumId}`

Body: 
```
{
  "albumId": "{albumId}",
  "businessId": "{businessId}",
  "description": "{description}",
  "icon": "{iconUrl}",
  "name": "{attributeName}",
  "parent": "{parent}",
  "userAttributes": [
    {
      "attribute": "{attributeId}",
      "value": "{value}"
    }
  ],
  "userAttributeGroups": [
    "{userAttributeGroupsIds}"
  ]
}
```

Response:
```
{
  "ancestors": [
    "b62e78dc-91ec-4db8-a3b4-f651192a4f27"
  ],
  "_id": "e537c35d-bd49-42e0-bfd6-6e6f80ad28c1",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "name": "January",
  "description": "description updated",
  "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
  "userAttributes": [
    {
      "attribute": {
        "_id": "417128cd-6c07-4b56-8430-b94db8a9563b",
        "icon": "http://test.com",
        "name": "ship 2",
        "type": "vehicle"
      },
      "value": "ford2"
    }
  ],
  "createdAt": "2020-07-29T13:40:53.717Z",
  "updatedAt": "2020-07-29T13:44:14.216Z",
  "__v": 0,
  "parent": "b62e78dc-91ec-4db8-a3b4-f651192a4f27"
}
```

#### Add album to multiple media
Role: merchant

Parameters:
- businessId
- albumId
- mediaIds: array of user media id that will be deleted

Request: POST
Url `http://localhost:3000/api/{businessId}/medias/add/album/{albumId}/`

Body: 
```
{
	"ids": [{mediaIds}]
}
```

Response: 201

#### Remove album from multiple media
Role: merchant

Parameters:
- businessId
- mediaIds: array of user media id that will be deleted

Request: DELETE
Url `http://localhost:3000/api/{businessId}/medias/remove/album`

Body: 
```
{
	"ids": [{mediaIds}]
}
```

Response: 201

#### Get Album level 0
Role: merchant

Parameters:
- businessId
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/{businessId}/album?page={page}&limit={limit}&asc=name&desc=updatedAt&asc=icon`

Response: 
```
[
  {
    "ancestors": [],
    "_id": "b62e78dc-91ec-4db8-a3b4-f651192a4f27",
    "business": "9b601fea-752b-4268-8892-79ff027e038a",
    "name": "false",
    "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
    "createdAt": "2020-07-29T09:21:20.930Z",
    "updatedAt": "2020-07-29T09:21:20.930Z",
    "__v": 0
  }
]
```

#### Get Album by Id
Role: merchant

Parameters:
- businessId
- albumId

Request: GET

Url: `http://localhost:3000/api/{businessId}/album/{albumId}`

Response: 
```
{
  "ancestors": [],
  "_id": "b62e78dc-91ec-4db8-a3b4-f651192a4f27",
  "business": "9b601fea-752b-4268-8892-79ff027e038a",
  "name": "false",
  "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
  "createdAt": "2020-07-29T09:21:20.930Z",
  "updatedAt": "2020-07-29T09:21:20.930Z",
  "__v": 0
}
```

#### Get Album by parent
Role: merchant

Parameters:
- businessId
- parentId: Id of parent album
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/{businessId}/album/parent/{parentId}?page={page}&limit={limit}&asc=name&desc=updatedAt&asc=icon`

Response: 
```
[
  {
    "ancestors": [
      "b62e78dc-91ec-4db8-a3b4-f651192a4f27"
    ],
    "_id": "e537c35d-bd49-42e0-bfd6-6e6f80ad28c1",
    "business": "9b601fea-752b-4268-8892-79ff027e038a",
    "name": "January",
    "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
    "createdAt": "2020-07-29T13:40:53.717Z",
    "updatedAt": "2020-07-29T13:44:14.216Z",
    "__v": 0,
    "parent": "b62e78dc-91ec-4db8-a3b4-f651192a4f27"
  }
]
```

#### Get Album by ancestor
Role: merchant

Get by ancestor will get all album that under one ancestor id. Like identifying grand parent as ancestor then the result will get children and grand children.

Parameters:
- businessId
- ancestor: Id of ancestor
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/{businessId}/album/ancestor/{parentId}?page={page}&limit={limit}&asc=name&desc=updatedAt&asc=icon`

Response: 
```
[
  {
    "ancestors": [
      "b62e78dc-91ec-4db8-a3b4-f651192a4f27"
    ],
    "_id": "e537c35d-bd49-42e0-bfd6-6e6f80ad28c1",
    "business": "9b601fea-752b-4268-8892-79ff027e038a",
    "name": "January",
    "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
    "createdAt": "2020-07-29T13:40:53.717Z",
    "updatedAt": "2020-07-29T13:44:14.216Z",
    "__v": 0,
    "parent": "b62e78dc-91ec-4db8-a3b4-f651192a4f27"
  }
]
```

#### Delete Album 
Role: merchant

Parameters:
- businessId
- albumId

Request: GET

Url: `http://localhost:3000/api/{businessId}/album/{parentId}`

Response: 200

#### Get user album by user attribute
Parameters:
- businessId
- page (optional): page
- limit (optional): limit per page
- attributeId: the id of attribute
- attributeValue: the value of attribute
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: Get

Url: `http://localhost:3000/api/{businessId}/album/by-user-attribute/{attributeId}/{attributeValue}?limit={limit}&page={page}&asc=name&desc=updatedAt&asc=url`

Response:
```
[
  {
    "ancestors": [],
    "_id": "f7b1392a-710a-4a35-a0a7-564e0a357594",
    "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
    "name": "test attribute on album 2",
    "description": "test attr album 2",
    "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
    "userAttributes": [
      {
        "attribute": {
          "_id": "beddbd7a-164f-4551-a44a-d532e25b615e",
          "icon": "http://test.com/icon.jpg",
          "name": "private",
          "type": "private"
        },
        "value": "true"
      }
    ],
    "createdAt": "2020-09-25T06:39:20.469Z",
    "updatedAt": "2020-09-25T06:39:20.469Z",
    "__v": 0
  }
]
```

#### Get user media by multiple user attribute
Parameters:
- businessId
- page (optional): page
- limit (optional): limit per page
- attributeId: the id of attribute
- attributeValue: the value of attribute
- asc or desc sortable fields (optional): including name, updatedAt, createdAt, and other thing that listed on the response below

Request: Post

Url: `http://localhost:3000/api/{businessId}/album/by-user-attribute?limit={limit}&page={page}&asc=name&desc=updatedAt&asc=url`

Body:
```
{
	"attributes": [
		{
			"attribute": "{attributeId}",
			"value": "{value}"
		},
		{
			"attribute": "{attributeId}",
			"value": "{value}"
		}
	]
}
```

Response:
```
[
  {
    "ancestors": [],
    "_id": "f7b1392a-710a-4a35-a0a7-564e0a357594",
    "business": "205954e0-4641-41fa-b6ca-6d0d83b37fad",
    "name": "test attribute on album 2",
    "description": "test attr album 2",
    "icon": "https://z.cash/wp-content/uploads/2020/03/zcash-sapling-icon-white.png",
    "userAttributes": [
      {
        "attribute": {
          "_id": "beddbd7a-164f-4551-a44a-d532e25b615e",
          "icon": "http://test.com/icon.jpg",
          "name": "private",
          "type": "private"
        },
        "value": "true"
      },
      {
        "attribute": {
          "_id": "534321e7-1d3a-4292-bdd1-f1f497323dd1",
          "icon": "http://test.com/icon.jpg",
          "name": "size",
          "type": "size"
        },
        "value": "800x400"
      }
    ],
    "createdAt": "2020-09-25T06:39:20.469Z",
    "updatedAt": "2020-09-25T06:39:20.469Z",
    "__v": 0
  }
]
```

### User subscribed media

#### Get user subscribed media 
Role: merchant

Parameters:
- businessId
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including updatedAt, createdAt, and other thing that listed on the response below

Requst: GET

Url: `http://localhost:3000/api/{businessId}/subscription?page={page}&limit={limit}&asc=subscriptionType&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "d763a6a6-fba2-43bb-93cf-faed73cdf2c7",
    "url": "https://payevertesting.blob.core.windows.net/images/017822da-96c0-4898-b94f-55bc0a740002-badge-icon-png-12516-sdssfs-33.png",
    "__v": 0,
    "attributes": [
      {
        "attribute": {
          "_id": "d09662a2-7ef5-465c-84a6-20cb8d367c01",
          "name": "ship",
          "type": "vehicle"
        },
        "value": "ship aja"
      }
    ],
    "createdAt": "2020-04-30T15:11:18.907Z",
    "mediaType": "image",
    "subscriptionType": 0,
    "updatedAt": "2020-04-30T15:11:18.907Z"
  }
]
```

#### Get user subscribed media by id 
Role: merchant

Parameters:
- businessId
- mediaId

Request: GET

Url: `http://localhost:3000/api/{businessId}/subscription/{mediaId}`

Response:
```
{
  "_id": "0f5d4aa7-b582-4c3d-abf5-5080ea19ee23",
  "url": "http://localhost:2020/video/sample.mp4",
  "__v": 0,
  "attributes": [
    {
      "attribute": {
        "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
        "name": "black",
        "type": "color"
      },
      "value": "test"
    }
  ],
  "createdAt": "2020-04-28T14:19:45.184Z",
  "mediaType": "video",
  "subscriptionType": 0,
  "updatedAt": "2020-04-28T14:19:45.184Z"
}
```

#### Get user subscribed media by attribute
Role: merchant

Parameters:
- businessId
- attributeId: the id of attribute
- attributeValue: the value of attribute
- page (optional)
- limit (optional)
- asc or desc sortable fields (optional): including updatedAt, createdAt, and other thing that listed on the response below

Request: GET

Url: `http://localhost:3000/api/{businessId}/subscription/attribute/{attributeId}/{attributeValue}?page={page}&limit={limit}&asc=subscriptionType&desc=updatedAt&asc=url`

Response:
```
[
  {
    "_id": "0f5d4aa7-b582-4c3d-abf5-5080ea19ee23",
    "url": "http://localhost:2020/video/sample.mp4",
    "__v": 0,
    "attributes": [
      {
        "attribute": {
          "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
          "name": "black",
          "type": "color"
        },
        "value": "test"
      }
    ],
    "createdAt": "2020-04-28T14:19:45.184Z",
    "mediaType": "video",
    "subscriptionType": 0,
    "updatedAt": "2020-04-28T14:19:45.184Z"
  }
]
```

#### Get user subscribed media by attribute
Role: merchant

Parameters:
- name: search based on name
- page (optional)
- limit (optional)

Request: GET

Url: `http://localhost:3000/api/{businessId}/subscription/search?page={page}&limit={limit}&name={name}`

Response:
```
[
  {
    "_id": "0f5d4aa7-b582-4c3d-abf5-5080ea19ee23",
    "url": "http://localhost:2020/video/sample.mp4",
    "__v": 0,
    "attributes": [
      {
        "attribute": {
          "_id": "ffb683ee-ec76-43c8-a7ec-d929d6a815e1",
          "name": "black",
          "type": "color"
        },
        "value": "test"
      }
    ],
    "createdAt": "2020-04-28T14:19:45.184Z",
    "mediaType": "video",
    "subscriptionType": 0,
    "updatedAt": "2020-04-28T14:19:45.184Z"
  }
]
```

### Stream media

#### Stream subscribed media
Role: merchant

Parameters:
- businessId
- mediaId

Request: GET

Url: `http://localhost:3000/api/{businessId}/stream/subscription/{mediaId}`

Response: 
- status 206, used for streaming video
- status 200, and return file for image

#### Stream user media
Role: merchant

Parameters:
- businessId
- mediaId

Request: GET

Url: `http://localhost:3000/api/{businessId}/stream/media/{mediaId}`

Response: 
- status 206, used for streaming video
- status 200, and return file for image

### NIMA: Neutral Image Assessment

- Images included in assets/test/images/ will undergo NIMA test
- for results check build job output

## Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# load tests
$ npm run test:artillery
```
