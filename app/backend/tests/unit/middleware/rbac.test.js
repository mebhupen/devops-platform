
const { authorize, ROLES } = require('../../../src/middleware/rbac');

describe('RBAC middleware', () => {
  it('should allow Admin', () => {
    const req = { user: { role: ROLES.ADMIN } };
    const res = {};
    const next = jest.fn();
    authorize(ROLES.ADMIN)(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
  it('should block Viewer from Admin route', () => {
    const req = { user: { role: ROLES.VIEWER } };
    const res = {};
    const next = jest.fn();
    authorize(ROLES.ADMIN)(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });
});
