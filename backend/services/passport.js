import passport from 'passport'
import LocalStrategy from 'passport-local'
import GoogleStrategy from 'passport-google-oauth20'

import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

        if (!user) {
            return done(null, false, { error: 'Incorrect email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return done(null, false, { error: 'Incorrect email or password' })
        }

        done(null, user)
    } catch (error) {
        done(error)
    }
}))

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "938098771234-bs3tih643rrer4upje3jmpm82ud2t67p.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL:
        "https://secure-leora-venuja-39acf74a.koyeb.app/auth/google/callback", // Ensure this URI is registered on Google Developer Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,
          },
        });

        if (user) {
          return done(null, user);
        }

        const newUser = await prisma.user.create({
          data: {
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          },
        });

        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);



passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return done(new Error('User not found'));
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
})