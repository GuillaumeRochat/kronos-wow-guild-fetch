# Kronos Wow Guild Fetch
[![Join the chat at https://gitter.im/KaivoAnastetiks/kronos-wow-guild-fetch](https://badges.gitter.im/KaivoAnastetiks/kronos-wow-guild-fetch.svg)](https://gitter.im/KaivoAnastetiks/kronos-wow-guild-fetch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Circle CI](https://circleci.com/gh/KaivoAnastetiks/kronos-wow-guild-fetch.svg?style=svg)](https://circleci.com/gh/KaivoAnastetiks/kronos-wow-guild-fetch)
[![Stories in Ready](https://badge.waffle.io/KaivoAnastetiks/kronos-wow-guild-fetch.svg?label=ready&title=Ready)](http://waffle.io/KaivoAnastetiks/kronos-wow-guild-fetch)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/54726acfefab4934ba6775ff5247e758)](https://www.codacy.com/app/kaivoanastetiks_2547/kronos-wow-guild-fetch)

## Description
Fetches data from the [Twinstar armory](http://armory.twinstar.cz/) and send the data in Firebase. It is meant to be used as a daily task to provided recent enough data. Since the armory data isn't changing very quickly, it doesn't need to be collected in real-time to be used efficiently.

## Structure
The project will be placed in lib/ with individual modules for each logical part. It will be divided as follow:

##### lib/models/
- activity.js
- character.js
- profession.js
- reputation.js

##### lib/scraper/
- activities.js
- characters.js
- professions.js
- reputations.js

##### lib/app/
- index.js
- guild-fetch.js
- guild-repository.js

## Data Fetch
The data will be taken from those four pages, each returning XML with all the corresponding information.

##### Get list of members :
- guild-info.xml?r=Realm&gn=Guild+Name

##### Get character profession :
- character-sheet.xml?r=Realm&cn=Character+Name

##### Get character reputation :
- character-reputation.xml?r=Realm&cn=Character+Name

##### Get character activity :
- character-feed-data.xml?r=Realm&cn=Character+Name&full=true

## Data Model
The data placed in firebase will be as follow:

```
{
    "Guild Name": {
        "characters": {
            "charactername": {
                "class": "warrior",
                "race": "human",
                "gender": 'male',
                "level": 60,
                "guildRank": 0,
                "dateAdded": "1970-01-01"
            }
        },
        "ex-characters": {
            "charactername": {
                "class": "warrior",
                "race": "human",
                "gender": 'male',
                "level": 60,
                "guildRank": 0,
                "dateAdded": "1970-01-01"
            }
        }
        "professions": {
            "mining": {
                "charactername": 300
            }
        },
        "reputation": {
            "stormwind": {
                "charactername": 42000
            }
        },
        "items": {
            "charactername": {
                "itemID": [
                    "1970-01-01T00:00:00+00:00",
                    "1970-01-02T00:00:00+00:00"
                ]
            }
        },
        "bosskills": {
            "charactername": {
                "bosskillID": {
                    "bossID": "bossID"
                    "dateKilled": "1970-01-01T00:00:00+00:00"
                }
            }
        }
    }
}
```

