import timezones from "../database/timezones.json"
import { Timezone, TimezoneImp } from "../models/timezone"

export class TimezonesController {
  findAll(): Timezone[] {
    return Object.keys(timezones).map(this.findOne)
  }
  findOne(id: string): Timezone {
    const timezone = new TimezoneImp(id)
    return timezone
  }
}
