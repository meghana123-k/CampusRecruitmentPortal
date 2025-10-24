import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define application status enum
export enum ApplicationStatus {
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
}

// Define application attributes interface
export interface ApplicationAttributes {
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

// Define optional attributes for creation
export interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

// Define Application model class
export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: number;
  public applicantName!: string;
  public applicantEmail!: string;
  public graduationYear?: number;
  public skills?: string;
  public coverLetter?: string;
  public status!: ApplicationStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check if application is pending
  public isPending(): boolean {
    return this.status === ApplicationStatus.PENDING;
  }

  // Instance method to check if application is shortlisted
  public isShortlisted(): boolean {
    return this.status === ApplicationStatus.SHORTLISTED;
  }

  // Instance method to check if application is rejected
  public isRejected(): boolean {
    return this.status === ApplicationStatus.REJECTED;
  }

  // Instance method to get status display name
  public getStatusDisplay(): string {
    const statusMap = {
      [ApplicationStatus.PENDING]: 'Pending',
      [ApplicationStatus.SHORTLISTED]: 'Shortlisted',
      [ApplicationStatus.REJECTED]: 'Rejected',
    };
    return statusMap[this.status];
  }

  // Instance method to get status color for UI
  public getStatusColor(): string {
    const colorMap = {
      [ApplicationStatus.PENDING]: 'orange',
      [ApplicationStatus.SHORTLISTED]: 'green',
      [ApplicationStatus.REJECTED]: 'red',
    };
    return colorMap[this.status];
  }
}

// Initialize Application model
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
      validate: {
        isEmail: true,
      },
    },
    graduationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 5,
      },
    },
    skills: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 2000],
      },
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