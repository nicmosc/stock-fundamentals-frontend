import { Sector } from '../types';
import { Color } from './color';

export function getSectorColors(
  sector: Sector,
): {
  default: string;
  light: string;
} {
  switch (sector) {
    case Sector.BASIC_MATERIALS:
      return {
        default: Color.red.primary!,
        light: Color.red[1],
      };
    case Sector.COMMUNICATION_SERVICES:
      return {
        default: Color.magenta.primary!,
        light: Color.magenta[1],
      };
    case Sector.CONSUMER_CYCLICAL:
      return {
        default: Color.geekblue.primary!,
        light: Color.geekblue[1],
      };
    case Sector.CONSUMER_DEFENSIVE:
      return {
        default: Color.volcano.primary!,
        light: Color.volcano[1],
      };
    case Sector.ENERGY:
      return {
        default: Color.green.primary!,
        light: Color.green[1],
      };
    case Sector.FINANCIAL_SERVICES:
      return {
        default: Color.blue.primary!,
        light: Color.blue[1],
      };
    case Sector.HEALTHCARE:
      return {
        default: Color.lime.primary!,
        light: Color.lime[1],
      };
    case Sector.INDUSTRIALS:
      return {
        default: Color.gold.primary!,
        light: Color.gold[1],
      };
    case Sector.TECHNOLOGY:
      return {
        default: Color.cyan.primary!,
        light: Color.cyan[1],
      };
    default:
      return {
        default: Color.grey[8],
        light: Color.grey[4],
      };
  }
}
