"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const DomainException_1 = require("../exceptions/DomainException");
const cuid2_1 = require("@paralleldrive/cuid2");
class User {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        const now = new Date();
        return new User({
            ...props,
            id: (0, cuid2_1.createId)(),
            isEmailVerified: false,
            createdAt: now,
            updatedAt: now,
        });
    }
    static rehydrate(props) {
        if (!props.id) {
            throw new DomainException_1.DomainException("invalid userId", 404);
        }
        return new User(props);
    }
    // getters - return only
    get id() {
        return this.props.id;
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this, this.props.password;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    get isEmailVerified() {
        return this.props.isEmailVerified;
    }
    get phoneNumber() {
        return this.props.phoneNumber;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    markAsVerified() {
        this.props.isEmailVerified = true;
        this.props.updatedAt = new Date();
    }
    updatePassword(newHashedPassword) {
        this.props.password = newHashedPassword;
        this.props.updatedAt = new Date();
    }
    updateEmail(email) {
        this.props.email = email;
        this.props.updatedAt = new Date();
    }
}
exports.User = User;
