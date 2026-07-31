/**
 * Shared in-memory user cache.
 * Avoids a MongoDB lookup on every authenticated page request.
 * TTL is short so changes (role, cart, etc.) propagate quickly.
 */
const cache = new Map();
const TTL_MS = 60 * 1000; // 60 seconds

function get(userId) {
    const entry = cache.get(userId);
    if (!entry) return null;
    if (Date.now() - entry.ts > TTL_MS) {
        cache.delete(userId);
        return null;
    }
    return entry.user;
}

function set(userId, user) {
    cache.set(userId, { user, ts: Date.now() });
    // Prevent unbounded growth — evict oldest entry when cache exceeds 500 users
    if (cache.size > 500) {
        cache.delete(cache.keys().next().value);
    }
}

function invalidate(userId) {
    cache.delete(String(userId));
}

module.exports = { get, set, invalidate };
