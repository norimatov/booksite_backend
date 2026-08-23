"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePremium = exports.PREMIUM_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PREMIUM_KEY = 'requiresPremium';
const RequirePremium = () => (0, common_1.SetMetadata)(exports.PREMIUM_KEY, true);
exports.RequirePremium = RequirePremium;
//# sourceMappingURL=premium.decorator.js.map