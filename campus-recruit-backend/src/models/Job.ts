import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

// Define job status enum
export enum JobStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed'
}

// Define job type enum
export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  CONTRACT = 'contract'
}

// Define job attributes interface
export interface JobAttributes {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobType;
  status: JobStatus;
  recruiterId: number;
  applicationDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional attributes for creation
export interface JobCreationAttributes extends Optional<JobAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

// Define Job model class
export class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public requirements!: string;
  public location!: string;
  public salaryMin?: number;
  public salaryMax?: number;
  public jobType!: JobType;
  public status!: JobStatus;
  public recruiterId!: number;
  public applicationDeadline?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check if job is active
  public isActive(): boolean {
    return this.status === JobStatus.ACTIVE;
  }

  // Instance method to check if job is open for applications
  public isOpenForApplications(): boolean {
    if (!this.isActive()) return false;
    if (!this.applicationDeadline) return true;
    return new Date() < this.applicationDeadline;
  }

  // Instance method to get salary range string
  public getSalaryRange(): string {
    if (this.salaryMin && this.salaryMax) {
      return `$${this.salaryMin.toLocaleString()} - $${this.salaryMax.toLocaleString()}`;
    } else if (this.salaryMin) {
      return `$${this.salaryMin.toLocaleString()}+`;
    } else if (this.salaryMax) {
      return `Up to $${this.salaryMax.toLocaleString()}`;
    }
    return 'Salary not specified';
  }

  // Instance method to get job type display name
  public getJobTypeDisplay(): string {
    const typeMap = {
      [JobType.FULL_TIME]: 'Full Time',
      [JobType.PART_TIME]: 'Part Time',
      [JobType.INTERNSHIP]: 'Internship',
      [JobType.CONTRACT]: 'Contract'
    };
    return typeMap[this.jobType];
  }
}

// Initialize Job model
Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 5000],
      },
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000],
      },
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    salaryMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    salaryMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    jobType: {
      type: DataTypes.ENUM(...Object.values(JobType)),
      allowNull: false,
      defaultValue: JobType.FULL_TIME,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(JobStatus)),
      allowNull: false,
      defaultValue: JobStatus.ACTIVE,
    },
    recruiterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
  },
  {
    sequelize,
    tableName: 'jobs',
    timestamps: true,
    indexes: [
      {
        fields: ['recruiterId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['jobType'],
      },
      {
        fields: ['applicationDeadline'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

// Define associations
Job.belongsTo(User, {
  foreignKey: 'recruiterId',
  as: 'recruiter',
});

User.hasMany(Job, {
  foreignKey: 'recruiterId',
  as: 'jobs',
});

export default Job;
