import CutoffConditionUtils, { CutoffCondition } from './CutoffCondition';

describe('CutoffCondition', () => {
  it('should represent the correct CLIENT_QUIT string', () => {
    expect(CutoffCondition.CLIENT_QUIT).toEqual('CLIENT_QUIT');
  });

  it('should represent the correct LONE_SURVIVOR string', () => {
    expect(CutoffCondition.LONE_SURVIVOR).toEqual('LONE_SURVIVOR');
  });

  it('should represent the correct RANK_STABLE string', () => {
    expect(CutoffCondition.RANK_STABLE).toEqual('RANK_STABLE');
  });

  it('should represent the correct TURN_LIMIT_REACHED string', () => {
    expect(CutoffCondition.TURN_LIMIT_REACHED).toEqual('TURN_LIMIT_REACHED');
  });
});

describe('CutoffConditionUtils toString', () => {
  it('should represent the correct CLIENT_QUIT string', () => {
    expect(CutoffConditionUtils.toString(CutoffCondition.CLIENT_QUIT)).toEqual(
      'Game aborted'
    );
  });

  it('should represent the correct LONE_SURVIVOR string', () => {
    expect(
      CutoffConditionUtils.toString(CutoffCondition.LONE_SURVIVOR)
    ).toEqual('One team remaining');
  });
  it('should represent the correct RANK_STABLE string', () => {
    expect(CutoffConditionUtils.toString(CutoffCondition.RANK_STABLE)).toEqual(
      'No spawn points remaining'
    );
  });
  it('should represent the correct TURN_LIMIT_REACHED string', () => {
    expect(
      CutoffConditionUtils.toString(CutoffCondition.TURN_LIMIT_REACHED)
    ).toEqual('Turn limit reached');
  });
});
