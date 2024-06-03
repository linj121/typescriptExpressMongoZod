import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

/**
 * - pre hook for hashing passwords using bcrypt before saving to db
 * - https://mongoosejs.com/docs/middleware.html#pre
 * - Rememeber to define middleware before compiling models!
 *   https://mongoosejs.com/docs/middleware.html#defining
 * - this in Pre-save Middleware: Refers to the document being saved. Allows access and modification of the document’s fields.
 * - this in Query Middleware: Refers to the query object, allowing modification of the query conditions.
 * - this in Post Middleware: Refers to the document or query that was just processed.
 */
userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

/**
 * https://mongoosejs.com/docs/guide.html#methods
 * https://medium.com/@armaancodes/schema-methods-in-mongodb-mongoose-efd6e6bb9cc8
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
