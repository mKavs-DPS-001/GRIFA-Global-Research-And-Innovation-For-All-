import admin from '../config/firebase-admin.js';
import User from '../models/User.js';

export async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { code: 'MISSING_TOKEN' } });
  }
  try {
    const token = header.split(' ')[1];
    req.firebaseUser = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN' } });
  }
}

export async function attachUserFromDB(req, res, next) {
  try {
    const { uid, email, name, picture } = req.firebaseUser;
    req.dbUser = await User.findOneAndUpdate(
      { firebase_uid: uid },
      { 
        $setOnInsert: { 
          email: email || '', 
          display_name: name || '', 
          photo_url: picture || '', 
          role: 'student', 
          createdAt: new Date() 
        } 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    next();
  } catch (error) {
    console.error('Error attaching user from DB:', error);
    return res.status(500).json({ success: false, error: { code: 'DATABASE_ERROR' } });
  }
}

export function checkRole(role) {
  return (req, res, next) => {
    if (req.dbUser?.role !== role) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN' } });
    }
    next();
  };
}
