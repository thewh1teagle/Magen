import { format } from 'date-fns';
import { areasJson, citiesJson, threatsJson } from "../../packages/magen_common_ts/src/lib";
import { ActiveAlert, Area, City, OrefUpdate } from "../../packages/magen_common_ts/src/interfaces";


export function getActiveAlerts(update: OrefUpdate): ActiveAlert[] {
    const alerts: ActiveAlert[] = []
    for (const city of update.cities) {
        alerts.push({
            is_test: update.is_test!,
            name: city,
            timestamp: new Date(),
            city: citiesJson?.[city],
            threat: threatsJson?.[update.category]
        })
    }
    return alerts
}

export function createMessage(alerts: ActiveAlert[]): string {

    const date = new Date()
    const formattedDate = format(date, 'dd/MM/yyyy | HH:mm:ss');

    let text = ''
    if (alerts?.[0].is_test) {
        text += '*בדיקה* *בדיקה* *בדיקה* *בדיקה* *בדיקה*\n\n'
    }
    text += `🔴 ${alerts?.[0].threat!.he} (${formattedDate})\n\n`
    const areasData: {[id: string]: ActiveAlert[]} = {}

    for (const alert of alerts) {       
        const areaID = alert.city?.area
        if (areaID) {
            const area: Area = citiesJson?.[areaID]
            if (areasData[areaID]) {
                areasData[areaID].push(alert)
            } else {
                areasData[areaID] = [alert]
            }
        }
    }
    for (const areaID in areasData) {
        const alerts: ActiveAlert[] = areasData[areaID]
        
        const areaData = areasJson?.[areaID]
        text += `*${areaData?.he}*: ${alerts.map(a => a.city!.he).join(', ')} (${alerts?.[0].city?.countdown} שניות)\n\n`
    }
    text += `\n\n[מגן - צבע אדום](https://t.me/MagenAlerts)`
    return text
}