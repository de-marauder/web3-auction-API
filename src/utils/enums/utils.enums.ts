export enum Errors {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  AUCTION_HAS_HIGHER_BID = 'There already is a higher bid',
  AUCTION_HAS_ENDED = 'Auction already ended',
  AUCTION_NOT_ENDED = 'Auction not yet ended',
  AUCTION_END_ALREADY_CALLED = 'auctionEnd has already been called',
  AUCTION_BID_VALUE_INVALID = 'Auction bid value invalid. Please pass a valid bid in ether',
}
export enum ResponseStatusEnum {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
export enum TimeUnits {
  SECOND = 1,
  MILLISECONDS = TimeUnits.SECOND / 1000,
  MINUTE = 60 * TimeUnits.SECOND,
  HOUR = 60 * TimeUnits.MINUTE,
  DAY = 24 * TimeUnits.HOUR,
  WEEK = 7 * TimeUnits.DAY,
  MONTH = 30 * TimeUnits.DAY,
  YEAR = 365 * TimeUnits.DAY,
}
