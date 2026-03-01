// Simple in-memory User model (fallback when MongoDB is not available)
class User {
    constructor(data) {
        this._id = data._id || Date.now().toString();
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    static users = new Map();

    static async findOne(query) {
        for (const user of User.users.values()) {
            if (query.email && user.email === query.email) {
                return user;
            }
            if (query.name && user.name === query.name) {
                return user;
            }
            if (query._id && user._id === query._id) {
                return user;
            }
        }
        return null;
    }

    static async findById(id) {
        return User.users.get(id) || null;
    }

    static async find() {
        return Array.from(User.users.values());
    }

    async save() {
        User.users.set(this._id, this);
        return this;
    }

    static async findOneAndUpdate(query, update) {
        const user = await this.findOne(query);
        if (user) {
            Object.assign(user, update);
            User.users.set(user._id, user);
        }
        return user;
    }

    // Simple password hashing (for demo purposes)
    static async hashPassword(password) {
        // Simple hash for demo - in production use bcrypt
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hashed_' + Math.abs(hash).toString(16);
    }

    // Simple password comparison (for demo purposes)
    async comparePassword(password) {
        const hashed = await User.hashPassword(password);
        return this.password === hashed || this.password === password;
    }
}

module.exports = User;
