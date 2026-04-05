import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class BlogPost extends Model {
  public declare id: number;
  public declare slug: string;
  public declare title: string;
  public declare description: string;
  public declare date: string;
  public declare thumbnail: string;
  public declare authorName: string;
  public declare authorPhoto: string;
  public declare content: string;
  public declare readTime: string;
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
    authorName: {
      type: DataTypes.STRING,
    },
    authorPhoto: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    readTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageCaption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "BlogPost",
  }
);
