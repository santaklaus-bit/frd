import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class BlogPost extends Model {
  public declare id: number;
  public declare slug: string;
  public declare title: string;
  public declare description: string;
  public declare date: string;
  public declare thumbnail: string;
  public declare content: string;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

BlogPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BlogPost",
  }
);
