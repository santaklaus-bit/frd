import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class BlogPost extends Model {
  public declare id: number;
  public declare slug: string;
  public declare slugEn: string;
  public declare titleFr: string;
  public declare titleEn: string;
  public declare descriptionFr: string;
  public declare descriptionEn: string;
  public declare date: string;
  public declare thumbnail: string;
  public declare authorName: string;
  public declare authorPhoto: string;
  public declare contentFr: string;
  public declare contentEn: string;
  public declare readTimeFr: string;
  public declare readTimeEn: string;
  public declare wordCountFr: number;
  public declare wordCountEn: number;
  public declare pdfUrlFr: string;
  public declare pdfUrlEn: string;
  public declare audioUrlFr: string;
  public declare audioUrlEn: string;
  public declare imageCaptionFr: string;
  public declare imageCaptionEn: string;
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
    slugEn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    titleFr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptionFr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptionEn: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    contentFr: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    contentEn: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    readTimeFr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    readTimeEn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wordCountFr: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wordCountEn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pdfUrlFr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pdfUrlEn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioUrlFr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioUrlEn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageCaptionFr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageCaptionEn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "BlogPost",
  }
);

