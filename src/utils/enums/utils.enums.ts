export enum Errors {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}
export enum ResponseStatusEnum {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
export enum TimeUnits {
  MILLISECONDS = 1,
  SECOND = 1000 * TimeUnits.MILLISECONDS,
  MINUTE = 60 * TimeUnits.SECOND,
  HOUR = 60 * TimeUnits.MINUTE,
  DAY = 24 * TimeUnits.HOUR,
  WEEK = 7 * TimeUnits.DAY,
  MONTH = 30 * TimeUnits.DAY,
  YEAR = 365 * TimeUnits.DAY,
}
