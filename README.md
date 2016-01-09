### Structure
#### lib/models/...
- character
- profession
- reputation
- item
- bosskill

#### lib/scraper/
- index.js

#### lib/app/
- index.js
- guild.js

### Data Fetch
#### Get list of members :
- guild-infoxml&r=Realm&gn=Guild+Name

#### Get character profession :
- character-sheet.xml?r=Realm&cn=Character+Name&gn=Guild+Name

#### Get character reputation :
- character-reputation.xml?r=Realm&cn=Character+Name&gn=Guild+Name

#### Get character activity :
- character-feed-data.xml?r=Realm&cn=Character+Name&gn=Guild+Name&full=true

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

