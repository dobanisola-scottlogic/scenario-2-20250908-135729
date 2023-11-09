export const removeMilestoneBotPrefix = (milestoneBotClassName: string) => {
  return milestoneBotClassName.replace('com.scottlogic.hackathon.bots.', '');
};
