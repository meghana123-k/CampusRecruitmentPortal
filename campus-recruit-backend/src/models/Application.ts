import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum ApplicationStatus {
  PENDING = 'pending',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
}

interface ApplicationAttributes {
  id: number;
  applicantName: string;
  applicantEmail: string;
  graduationYear?: number;
  skills?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type ApplicationCreationAttributes = Optional<
  ApplicationAttributes,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export class Application
  extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public id!: number;
  public applicantName!: string;
  public applicantEmail!: string;
  public graduationYear?: number;
  public skills?: string;
  public coverLetter?: string;
  public status!: ApplicationStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    applicantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicantEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    graduationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      allowNull: false,
      defaultValue: ApplicationStatus.PENDING,
    },
  },
  {
    sequelize,
    tableName: 'applications',
    timestamps: true,
  }
);

export default Application;
