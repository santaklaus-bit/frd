import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class Dictionary extends Model {
  public declare id: number;
  public declare lang: string;
  public declare content: any;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Dictionary.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    lang: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: { type: DataTypes.JSON, allowNull: false },
  },
  { sequelize, modelName: "Dictionary" }
);
