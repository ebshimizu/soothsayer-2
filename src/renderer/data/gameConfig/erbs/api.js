import Characters from './characters'

const erbsApiBase = 'https://open-api.bser.io/v1'

const SEASONS = {
  Unranked: 0,
  'Ranked Season 1': 1,
  'Pre-Season 2': 2,
  'Season 2': 3,
  'Pre-Season 3': 4,
  'Season 3': 5,
  'Pre-season 4': 6,
}

const SQUAD_SIZES = {
  Solos: 1,
  Duos: 2,
  Trios: 3,
}

async function getPlayerStats(playerName, season, teamMode, key, setStatus) {
  // get the player id first
  setStatus('Retrieving user id')

  try {
    const nicknameReq = await fetch(
      `${erbsApiBase}/user/nickname?query=${playerName}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-api-key': key,
        },
      },
    )
    const nickname = await nicknameReq.json()

    if (nickname.code === 200) {
      // use the id to get the player stats
      setStatus(`Retrieving stats for player id ${nickname.user.userNum}`)

      const statsReq = await fetch(
        `${erbsApiBase}/user/stats/${nickname.user.userNum}/${season}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-api-key': key,
          },
        },
      )

      const stats = await statsReq.json()

      if (stats.code === 200) {
        setStatus('Locating Squad Size Data')

        // return the relevant stats
        const playerStats = stats.userStats.find(
          (s) => s.matchingTeamMode === teamMode,
        )

        if (playerStats) {
          return {
            avgHunts: playerStats.averageHunts,
            winRate: playerStats.totalWins / playerStats.totalGames,
            top3: playerStats.top3,
            avgKills: playerStats.averageKills,
            characters: playerStats.characterStats.map((cs) => {
              return Characters[cs.characterCode].ltImgSrc
            }),
          }
        } else {
          setStatus(
            `Failed to retrieve player stats for squad size ${teamMode}`,
            true,
          )
        }
      } else {
        setStatus(
          `Failed to retrieve player stats from API. Code ${stats.code}`,
          true,
        )
      }
    } else {
      setStatus(`Failed to retrieve data from API. Code ${nickname.code}`, true)
    }
  } catch (e) {
    console.log(e)
    setStatus(`Failed to retrieve data from API. Reason: ${e}`, true)
  }

  return null
}

export { getPlayerStats, SEASONS, SQUAD_SIZES }
