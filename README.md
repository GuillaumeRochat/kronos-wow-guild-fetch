# Kronos Wow Guild Fetch
[![Circle CI](https://circleci.com/gh/KaivoAnastetiks/kronos-wow-guild-fetch.svg?style=svg)](https://circleci.com/gh/KaivoAnastetiks/kronos-wow-guild-fetch)
[![Stories in Ready](https://badge.waffle.io/KaivoAnastetiks/kronos-wow-guild-fetch.svg?label=ready&title=Ready)](http://waffle.io/KaivoAnastetiks/kronos-wow-guild-fetch)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/54726acfefab4934ba6775ff5247e758)](https://www.codacy.com/app/kaivoanastetiks_2547/kronos-wow-guild-fetch)

## Description
Fetches data from the [Twinstar armory](http://armory.twinstar.cz/) and send the data in Firebase. It is meant to be used as a daily task to provided recent enough data. Since the armory data isn't changing very quickly, it doesn't need to be collected in real-time to be used efficiently.

## Structure
The project will be placed in lib/ with individual modules for each logical part. It will be divided as follow:

##### lib/models/
- character.js
- profession.js
- reputation.js
- item.js
- bosskill.js

##### lib/scraper/
- index.js

##### lib/app/
- index.js
- guild.js

## Data Fetch
The data will be taken from those four pages, each returning XML with all the corresponding information.

##### Get list of members :
- guild-info.xml?r=Realm&gn=Guild+Name

##### Get character profession :
- character-sheet.xml?r=Realm&cn=Character+Name&gn=Guild+Name

##### Get character reputation :
- character-reputation.xml?r=Realm&cn=Character+Name&gn=Guild+Name

##### Get character activity :
- character-feed-data.xml?r=Realm&cn=Character+Name&gn=Guild+Name&full=true

## Data Model
The data placed in firebase will be as follow:

```
{
    "Guild Name": {
        "members": {
            "charactername": { "level": "level", "timestamp": "timestamp" }
        },
        "ex-members": {
            "charactername": { "level": "level", "timestamp": "timestamp" }
        }
        "professions": {
            "profession 1": {
                "charactername": "level"
            }
        },
        "reputation": {
            "faction": {
                "charactername": "reputation"
            }
        },
        "items": {
            "charactername": [{
                "itemid": { "itemname": "itemname", "dateobtained": "dateobtained" }
            }]
        },
        "bosskill": {
            "charactername": [{
                "bossid": { "bossname": "bossname", "datekilled": "datekilled" }
            }]
        }
    }
}
```

