
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planet.mongo')

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

const loadPlanetsData = () => {
    return new Promise((resorve, reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    savePlanets(data)
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err)
            })
            .on('end', async() => {
                const countPlanetsfound =(await getAllPlanets()).length
                console.log(`${countPlanetsfound} habitable planets found!`);
                resorve()
            });
        
    })
}
async function getAllPlanets() {
    return await planets.find({}, {
        '_id': 0,
        '__v':0
    })
}
async function savePlanets(planet) {
    try {
        await planets.updateOne({
                        keplerName: planet.kepler_name,
                    }, {
                         keplerName: planet.kepler_name
                    }, {
                        upsert: true,
                    }
                    )
    } catch (err) {
        console.error(`Could not save planet ${err}`)
    }
     
}

module.exports = {
      loadPlanetsData,
      getAllPlanets
  }