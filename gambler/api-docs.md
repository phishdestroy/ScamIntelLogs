# Gambler Partners API — Documentation

> **Leaked API documentation** from the GAMBLER fake casino Scam-as-a-Service panel.
> Source: `wiki.gambler-partners.is/dlya-tsov/api-docs`
> This documentation is provided for threat intelligence and law enforcement purposes only.

---

## Base URL

```
https://gambler-partners.is/api
```

All methods require authorization header:

```
Authorization: <api_token>
```

**Requirement:** Server IP address must be whitelisted by panel administrators before API access is granted.

---

## Promo Codes

### **GET** `/me/promo/:promo`

Retrieve a specific promo code.

**Response (not found):**
```json
{ "success": false, "error": "Promo with same name doesn't exist" }
```

**Response (success):**
```json
{
  "success": true,
  "data": {
    "name": "STRING",
    "amount": 0,
    "activations": 0,
    "deposits": 0
  }
}
```

---

### **GET** `/me/promo`

List all promo codes.

**Response:**
```json
{
  "success": true,
  "data": []
}
```

---

### **POST** `/me/promo`

Create a new promo code.

**Body:**
```json
{
  "name": "STRING",
  "amount": 0,
  "shouldWager": false
}
```

**Errors:**
- `400 Bad request`
- `Promo with same name already exists`

---

### **PATCH** `/me/promo`

Modify an existing promo code.

**Body:**
```json
{
  "name": "STRING",
  "amount": 0,
  "shouldWager": false
}
```

**Errors:**
- `400 Bad request`
- `Promo with same name doesn't exist`

---

### **DELETE** `/me/promo`

Delete a promo code.

**Body:**
```json
{ "name": "STRING" }
```

**Errors:**
- `400 Bad request`
- `Promo with same name doesn't exist`

---

## Mammoths (Victims)

> GAMBLER internally refers to scam victims as "mammoths" (мамонты).

### **GET** `/api/me/mammoths/:id/txs/wallets`

Retrieve wallet addresses for a specific victim.

**Example:**
```javascript
const axios = require('axios');
axios.get(
  'https://gambler-panel.com/api/me/mammoths/7225647165131980801/txs/wallets',
  { headers: { Authorization: "3twCYS3kpzMlb2RqWq..." } }
).then(r => console.log(r));
```

**Response (not found):**
```json
{ "success": false, "error": "Mammoth not found" }
```

**Response (no addresses):**
```json
{ "success": false, "error": "Mammoth has no addresses" }
```

**Response (success):**
```json
{
  "success": true,
  "data": [
    {
      "network": "erc20",
      "address": "0x123123..."
    }
  ]
}
```

**Supported networks:** `btc`, `xrp`, `erc20`, `bep20`, `trc20`, `sol`, `ton`, `base`

---

## Domains

### **GET** `/me/domains`

List all domains assigned to the current worker.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "STRING",
      "nameservers": ["STRING"]
    }
  ]
}
```

---

### **POST** `/me/domains`

Add a new phishing domain.

**Body:**
```json
{
  "webVersion": "green",
  "domain": "STRING",
  "template": "STRING",
  "pixelId": "STRING"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `webVersion` | string (optional) | Casino design variant: `green`, `trump`, `musk`, `blue` |
| `domain` | string | Domain name to add |
| `template` | string (optional) | Landing page template name |
| `pixelId` | string (optional) | Facebook Pixel ID for tracking |

**Errors:**
- `400 Bad request`
- `Domain exists`
- `Cannot create a zone`

**Response (success):** Returns array of nameservers to configure.

---

### **DELETE** `/me/domains`

Remove a domain.

**Body:**
```json
{ "domain": "STRING" }
```

**Errors:**
- `400 Bad request`
- `Domain not found`

---

### **POST** `/me/domains/verify`

Verify nameserver propagation for a domain.

**Body:**
```json
{ "domain": "STRING" }
```

**Errors:**
- `400 Bad request`
- `Domain not found`
- `Domain already verified`
- `You can check domain only one time per 10 minutes`
- `Cannot manage a zone`
- `Still pending`

---

### **POST** `/me/domains/template`

Change landing page template for a domain.

**Body:**
```json
{
  "domain": "STRING",
  "template": "STRING"
}
```

**Errors:**
- `400 Bad request`
- `Domain not found`
- `Invalid template`

#### Available Templates

**Green casino** (standard):
`default`, `standard_2`, `ronaldo`, `ronaldo_2`, `trump`, `elon_musk`, `mbappe`, `angelina_jolie`, `keanu_reeves`, `50_cent`, `kylie_jenner`, `selena_gomez`, `hades`, `olympus`, `plinko`, `coinflip`, `sugar_rush`, `sweet_bonanza`, `the_dog_house`, `dice`, `playboy`, `girl`, `girl2`–`girl5`, `brazzers`, `brazzers_2`, `18_1`–`18_8`, `anime_1`, `anime_2`, `18_brazzers`, `18_brazzers_2`, `18_brazzers_3`, `18_p_1`–`18_p_3`, `trans_1`–`trans_9`

**Blue casino** (legacy):
`default`, `lionel_messi`, `elon_musk`, `conor_mcgregor`, `cristiano_ronaldo`, `lionel_messi_2`, `gates_of_olympus`, `star_xu`, `the_dog_house`, `changpeng_zhao`, `sky_bounty`, `ben_zhou`, `sweet_bonanza`, `mr_beast`, `zeus_vs_hades`, `chicken_cross`, `sugar_rush`, `aviamasters`, `girl`, `drake`, `girl2`

**Trump casino**:
`default`, `t_solo_trump`, `t_solo_trump1`–`t_solo_trump5`, `t_solo_melania`, `t_solo_melania1`–`t_solo_melania3`, `t_reaction_trump`, `t_reaction_trump1`–`t_reaction_trump5`, `t_star_snoop`, `t_star_eminem`, `t_star_50eminem`, `t_star_kanye`, `t_star_50cent`, `t_slot_zeus`, `t_slot_olympus`, `t_slot_lebandit`, `t_slot_bonanza`, `t_slot_rush`, `t_slot_doghouse`, `t_game_plinko`, `t_game_mines`, `t_game_dice`, `t_game_tower`, `t_game_crash`, `t_game_limbo`, `t_game_coinflip`, `t_free_reward`, `t_aviamasters`, `t_girl`, `t_girl1`–`t_girl5`, `t_girl_18p`, `t_girl_18p1`–`t_girl_18p30`, `t_girl_18pp`, `t_girl_18pp1`–`t_girl_18pp5`

**Elon Musk casino**:
`default`, `e_solo_elon`, `e_solo_elon1`–`e_solo_elon9`, `e_reaction_elon`, `e_reaction_elon1`–`e_reaction_elon5`, `e_star_snoop`, `e_star_eminem`, `e_star_50eminem`, `e_star_kanye`, `e_star_50cent`, `e_slot_zeus`, `e_slot_olympus`, `e_slot_lebandit`, `e_slot_bonanza`, `e_slot_rush`, `e_slot_doghouse`, `e_game_plinko`, `e_game_mines`, `e_game_dice`, `e_game_tower`, `e_game_crash`, `e_game_limbo`, `e_game_coinflip`, `e_free_reward`, `e_aviamasters`, `e_girl`, `e_girl1`–`e_girl5`, `e_girl_18p`, `e_girl_18p1`–`e_girl_18p30`, `e_girl_18pp`, `e_girl_18pp1`–`e_girl_18pp5`

---

### **POST** `/me/domains/geoblock`

Configure geographic blocking (Cloudflare WAF rules).

**Body:**
```json
{
  "domain": "STRING",
  "countries": ["us", "gb"]
}
```

Country codes: ISO 3166-1 alpha-2, lowercase.

**Errors:**
- `400 Bad request`
- `Domain not found`
- `Domain is not active`
- `You can modify geo block one time per 5 minutes`
- `Cannot find cloudflare`
- `Invalid country`
- `Cannot fetch waf`
- `Unknown error while adding rule`

---

### **POST** `/me/domains/ai`

Enable or disable GAMBLER AI in live support chat for a domain.

**Body:**
```json
{
  "domain": "STRING",
  "useAI": true
}
```

**Errors:**
- `Invalid domain`
- `400 Bad request`
- `Domain not found`

---

### **POST** `/me/domains/regpage`

Set the redirect page shown after victim registration.

**Body:**
```json
{
  "domain": "STRING",
  "value": "deposit"
}
```

**Available values:** `mines`, `plinko`, `crash`, `limbo`, `dice`, `coinflip`, `tower`, `bonuses`, `deposit`, `withdraw`

---

## Games

### **GET** `/api/me/extra/crash`

Get predicted multiplier coefficient for the Crash game. Used by workers to front-run victims.

**Response:**
```json
{
  "success": true,
  "data": {
    "startsAt": "2026-01-15T12:00:00.000Z",
    "multiplier": 2.45
  }
}
```

**Note:** Cache the multiplier until game start to minimize API calls. Coefficient is predetermined — the game is fully rigged.

---

## Summary of Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/me/promo/:promo` | Get specific promo code |
| **GET** | `/me/promo` | List all promo codes |
| **POST** | `/me/promo` | Create promo code |
| **PATCH** | `/me/promo` | Modify promo code |
| **DELETE** | `/me/promo` | Delete promo code |
| **GET** | `/api/me/mammoths/:id/txs/wallets` | Get victim wallet addresses |
| **GET** | `/me/domains` | List all domains |
| **POST** | `/me/domains` | Add domain |
| **DELETE** | `/me/domains` | Remove domain |
| **POST** | `/me/domains/verify` | Verify nameservers |
| **POST** | `/me/domains/template` | Change landing template |
| **POST** | `/me/domains/geoblock` | Configure geo-blocking |
| **POST** | `/me/domains/ai` | Toggle AI support |
| **POST** | `/me/domains/regpage` | Set registration redirect |
| **GET** | `/api/me/extra/crash` | Get rigged Crash multiplier |

---

*Extracted from GAMBLER Partners wiki for threat intelligence purposes. January 2026.*
