export enum CutoffCondition {
  CLIENT_QUIT = 'CLIENT_QUIT',
  LONE_SURVIVOR = 'LONE_SURVIVOR',
  RANK_STABLE = 'RANK_STABLE',
  TURN_LIMIT_REACHED = 'TURN_LIMIT_REACHED',
}

export default class CutoffConditionUtils {
  static toString(cutOffCondition: CutoffCondition) {
    switch (cutOffCondition) {
      case CutoffCondition.CLIENT_QUIT:
        return 'Game aborted';

      case CutoffCondition.LONE_SURVIVOR:
        return 'One team remaining';

      case CutoffCondition.RANK_STABLE:
        return 'No spawn points remaining';

      case CutoffCondition.TURN_LIMIT_REACHED:
        return 'Turn limit reached';
    }
  }
}
