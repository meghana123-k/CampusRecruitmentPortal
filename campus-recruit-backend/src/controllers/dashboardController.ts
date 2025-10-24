import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import Job from '../models/Job';
import Application from '../models/Application';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const role = req.userRole;
    const userEmail = req.user?.email;

    if (!role) return res.status(401).json({ message: 'User not authenticated' });

    const data: any = {
      totalUsers: 0,
      totalJobs: 0,
      totalApplications: 0,
      totalStudents: 0,
      myJobs: 0,
      receivedApplications: 0,
      shortlistedCandidates: 0,
      availableJobs: 0,
      myApplications: 0,
      interviews: 0,
    };

    switch (role) {
      case UserRole.ADMIN:
        data.totalUsers = await User.count();
        data.totalJobs = await Job.count();
        data.totalApplications = await Application.count();
        data.totalStudents = await User.count({ where: { role: UserRole.STUDENT } });
        break;

      case UserRole.RECRUITER:
        const userId = req.userId;
        if (!userId) throw new Error('User not authenticated');

        data.myJobs = await Job.count({ where: { recruiterId: userId } });

        // Option 1: approximate applications by matching skills to jobs titles
        const myJobs = await Job.findAll({ where: { recruiterId: userId } });
        const jobTitles = myJobs.map(j => j.title);

        data.receivedApplications = await Application.count({
          where: {
            skills: jobTitles.length > 0 ? jobTitles : undefined,
          },
        });
        break;

      case UserRole.STUDENT:
        if (!userEmail) throw new Error('User not authenticated');
        data.availableJobs = await Job.count({ where: { status: 'active' } });
        data.myApplications = await Application.count({ where: { applicantEmail: userEmail } });
        break;
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};
