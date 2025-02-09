import { Schema } from 'mongoose';
import { ApplicationSchema } from './application.schema';

export const ChannelSettingsSchema: Schema = new Schema({
  activePosList: [ApplicationSchema],
  activeStoreList: [ApplicationSchema],
  bubble: {
    calculatorOverlay: Boolean,
    checkoutOverlay: Boolean,
    visibility: Boolean,
  },
  button: {
    adaptive: Boolean,
    alignment: String,
    buttonColor: String,
    calculatorOverlay: Boolean,
    checkoutOverlay: Boolean,
    corner: String,
    textColor: String,
    textSize: String,
    visibility: Boolean,
  },
  calculator: {
    adaptive: Boolean,
    backgroundColor: String,
    buttonColor: String,
    calculatorOverlay: Boolean,
    checkoutOverlay: Boolean,
    frameColor: String,
    linkColor: String,
    textColor: String,
    visibility: Boolean,
  },
  textLink: {
    adaptive: Boolean,
    alignment: String,
    calculatorOverlay: Boolean,
    checkoutOverlay: Boolean,
    linkColor: String,
    textSize: String,
    visibility: Boolean,
  },
});
