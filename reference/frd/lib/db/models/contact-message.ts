import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class ContactMessage extends Model {
  public declare id: number;
  public declare fullName: string;
  public declare email: string;
  public declare requestType: string;
  public declare message: string;
  public declare isRead: boolean;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

ContactMessage.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    requestType: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "ContactMessage" }
);
