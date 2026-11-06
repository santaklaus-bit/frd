import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class Subscriber extends Model {
  public declare id: number;
  public declare email: string;
  public declare subscribedAt: Date;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Subscriber.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    subscribedAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: "Subscriber" }
);
