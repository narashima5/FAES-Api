export const generateMonthlyFacultyReport = (users, submissions, sections, currentMonth, currentYear) => {
    let first3Sections = [];
    let fourthSection = null;

    sections.forEach(s => {
      const t = s.title.toLowerCase();
      if (t.includes("students activity") || t.includes("department activity") || t.includes("institution activity")) {
        first3Sections.push(s._id.toString());
      } else if (t.includes("self development")) {
        fourthSection = s._id.toString();
      }
    });

    const report = users.map(user => {
      let sectionScores = {};
      sections.forEach(s => {
        sectionScores[s._id.toString()] = { title: s.title, marks: 0 };
      });

      const userSubs = submissions.filter(s => s.user_id.toString() === user._id.toString());
      
      const activities = userSubs.map(s => {
        const secId = s.activity_id && s.activity_id.section_id ? s.activity_id.section_id.toString() : null;
        if (secId && sectionScores[secId]) {
          sectionScores[secId].marks += (s.marks || 0);
        }
        return {
          submission_id: s._id,
          activity_title: s.activity_id ? s.activity_id.title : 'Unknown',
          max_marks: s.activity_id ? s.activity_id.max_marks : 0,
          section_id: secId,
          section_title: secId && sectionScores[secId] ? sectionScores[secId].title : 'Unknown',
          sub_section_title: s.activity_id?.sub_section_id?.title || 'General',
          marks_obtained: s.marks || 0,
          status: s.status
        };
      });

      let total1_3 = 0;
      first3Sections.forEach(secId => {
        if (sectionScores[secId]) {
          total1_3 += Number(sectionScores[secId].marks);
        }
      });
      
      let scaled1_3 = (total1_3 / 3) * 2;

      let total4 = 0;
      if (fourthSection && sectionScores[fourthSection]) {
        total4 = Number(sectionScores[fourthSection].marks);
      }

      const finalScore = scaled1_3 + total4;

      return {
        user: { _id: user._id, name: user.name, email: user.email, department_id: user.department_id },
        month: currentMonth,
        year: currentYear,
        activities,
        section_scores: Object.values(sectionScores),
        calculations: {
          total_first_3_sections: total1_3,
          scaled_first_3_sections: Number(scaled1_3.toFixed(2)),
          total_last_section: total4,
          final_score: Number(finalScore.toFixed(2))
        }
      };
    });

    return report;
};
