import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CEO Conclave 2027 database...");

  // ========== ROLES & PERMISSIONS ==========
  const permissions = [
    { key: "dashboard.view", name: "View Dashboard", module: "dashboard" },
    { key: "event.manage", name: "Manage Event Settings", module: "event" },
    { key: "pages.manage", name: "Manage Pages & Content", module: "pages" },
    { key: "speakers.manage", name: "Manage Speakers", module: "speakers" },
    { key: "agenda.manage", name: "Manage Agenda", module: "agenda" },
    { key: "sponsors.manage", name: "Manage Sponsors", module: "sponsors" },
    { key: "requests.view", name: "View Invitation Requests", module: "requests" },
    { key: "requests.review", name: "Approve/Reject Requests", module: "requests" },
    { key: "requests.bulk", name: "Bulk Actions on Requests", module: "requests" },
    { key: "passes.manage", name: "Manage Passes", module: "passes" },
    { key: "checkin.perform", name: "Perform Check-in", module: "checkin" },
    { key: "contacts.manage", name: "Manage Organiser Contacts", module: "contacts" },
    { key: "emails.manage", name: "Manage Emails & Campaigns", module: "emails" },
    { key: "reminders.manage", name: "Manage Reminders", module: "reminders" },
    { key: "users.manage", name: "Manage Users & Roles", module: "users" },
    { key: "reports.export", name: "Export Reports", module: "reports" },
    { key: "audit.view", name: "View Audit Logs", module: "audit" },
    { key: "system.settings", name: "System Settings", module: "system" },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: {},
      create: p,
    });
  }

  const allPerms = await prisma.permission.findMany();
  const permMap = Object.fromEntries(allPerms.map((p) => [p.key, p.id]));

  // Super Admin - all permissions
  const superAdminRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: {
      name: "Super Admin",
      description: "Full access to everything",
      isSystem: true,
    },
  });

  for (const p of allPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: p.id },
    });
  }

  // Event Manager
  const eventManagerRole = await prisma.role.upsert({
    where: { name: "Event Manager" },
    update: {},
    create: {
      name: "Event Manager",
      description: "Event info, pages, agenda, requests, passes, communications",
      isSystem: true,
    },
  });
  const emPerms = [
    "dashboard.view", "event.manage", "pages.manage", "speakers.manage",
    "agenda.manage", "sponsors.manage", "requests.view", "requests.review",
    "requests.bulk", "passes.manage", "checkin.perform", "contacts.manage",
    "emails.manage", "reminders.manage", "reports.export",
  ];
  for (const key of emPerms) {
    if (permMap[key]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: eventManagerRole.id, permissionId: permMap[key] } },
        update: {},
        create: { roleId: eventManagerRole.id, permissionId: permMap[key] },
      });
    }
  }

  // Registration Manager
  const regManagerRole = await prisma.role.upsert({
    where: { name: "Registration Manager" },
    update: {},
    create: {
      name: "Registration Manager",
      description: "View and review requests, manage passes, check-in",
      isSystem: true,
    },
  });
  const rmPerms = ["dashboard.view", "requests.view", "requests.review", "requests.bulk", "passes.manage", "checkin.perform", "reports.export"];
  for (const key of rmPerms) {
    if (permMap[key]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: regManagerRole.id, permissionId: permMap[key] } },
        update: {},
        create: { roleId: regManagerRole.id, permissionId: permMap[key] },
      });
    }
  }

  // Speaker Manager
  const speakerManagerRole = await prisma.role.upsert({
    where: { name: "Speaker Manager" },
    update: {},
    create: {
      name: "Speaker Manager",
      description: "Manage speakers and sessions",
      isSystem: true,
    },
  });
  for (const key of ["dashboard.view", "speakers.manage", "agenda.manage"]) {
    if (permMap[key]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: speakerManagerRole.id, permissionId: permMap[key] } },
        update: {},
        create: { roleId: speakerManagerRole.id, permissionId: permMap[key] },
      });
    }
  }

  // Sponsor Manager
  const sponsorManagerRole = await prisma.role.upsert({
    where: { name: "Sponsor Manager" },
    update: {},
    create: {
      name: "Sponsor Manager",
      description: "Manage sponsors and enquiries",
      isSystem: true,
    },
  });
  for (const key of ["dashboard.view", "sponsors.manage"]) {
    if (permMap[key]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: sponsorManagerRole.id, permissionId: permMap[key] } },
        update: {},
        create: { roleId: sponsorManagerRole.id, permissionId: permMap[key] },
      });
    }
  }

  // Check-in Staff
  const checkinRole = await prisma.role.upsert({
    where: { name: "Check-in Staff" },
    update: {},
    create: {
      name: "Check-in Staff",
      description: "Scan QR and check-in attendees",
      isSystem: true,
    },
  });
  for (const key of ["checkin.perform"]) {
    if (permMap[key]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: checkinRole.id, permissionId: permMap[key] } },
        update: {},
        create: { roleId: checkinRole.id, permissionId: permMap[key] },
      });
    }
  }

  // ========== EVENT ==========
  const event = await prisma.event.upsert({
    where: { id: "ceo-conclave-2027-main" },
    update: {},
    create: {
      id: "ceo-conclave-2027-main",
      name: "THE CEO CONCLAVE 2027",
      tagline: "One Platform. Powerful Perspectives.",
      category: "Business & Corporate | CEO Round Table Discussion",
      subcategory: "Leadership & Entrepreneurship Summit",
      startDate: new Date("2027-01-22"),
      endDate: new Date("2027-01-23"),
      dailyStartTime: "09:30",
      dailyEndTime: "16:00",
      timezone: "Asia/Kolkata",
      venueName: "ITC Gardenia",
      venueAddress: "1, Residency Road, Ashok Nagar, Bengaluru, Karnataka - 560025",
      proposedHall: "Mysore Hall",
      format: "Individual sessions, panel discussions and audience Q&A",
      entryType: "Invitation only",
      expectedAudience: 180,
      vision: "To connect India's business leaders, encourage powerful discussions and inspire the next generation of entrepreneurs.",
      aboutText: "The CEO Conclave 2027 is an exclusive two-day business leadership event that brings together prominent CEOs, entrepreneurs, founders and industry experts from across India. It creates a platform where business leaders share experiences, discuss real-world management challenges, exchange ideas and explore strategies for sustainable growth. Unlike traditional conferences, it focuses on meaningful conversations, practical knowledge and collaborative problem-solving.",
      disclaimer: "Dates, venue booking, speaker participation, sponsorships and attendance are proposed and subject to confirmation. All six speakers are proposed invitees, not confirmed speakers.",
      showProposedSpeakers: true,
      hardCapacityLimit: false,
      capacityLimit: 180,
      isPublished: true,
    },
  });

  // ========== PAGES ==========
  const pages = [
    { slug: "home", title: "Home", sortOrder: 1 },
    { slug: "about", title: "About the Event", sortOrder: 2 },
    { slug: "speakers", title: "Speakers", sortOrder: 3 },
    { slug: "agenda", title: "Agenda", sortOrder: 4 },
    { slug: "topics", title: "Discussion Topics", sortOrder: 5 },
    { slug: "sponsors", title: "Sponsors", sortOrder: 6 },
    { slug: "venue", title: "Venue", sortOrder: 7 },
    { slug: "request-invitation", title: "Request Invitation", sortOrder: 8 },
    { slug: "request-status", title: "Request Status", sortOrder: 9 },
    { slug: "contact", title: "Contact", sortOrder: 10 },
    { slug: "privacy", title: "Privacy Policy", sortOrder: 11 },
    { slug: "terms", title: "Terms and Conditions", sortOrder: 12 },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { eventId_slug: { eventId: event.id, slug: p.slug } },
      update: {},
      create: {
        eventId: event.id,
        slug: p.slug,
        title: p.title,
        metaTitle: `${p.title} | THE CEO CONCLAVE 2027`,
        isEnabled: true,
        sortOrder: p.sortOrder,
      },
    });
  }

  // ========== SPEAKERS ==========
  const speakersData = [
    {
      name: "Falguni Nayar",
      designation: "Founder, Executive Chairperson and MD, Nykaa",
      industry: "E-commerce and Retail",
      sessionTopic: "From Startup to Success - Building a Powerful Business Brand",
      day: 1,
      sortOrder: 1,
    },
    {
      name: "Priya Nair",
      designation: "CEO and MD, Hindustan Unilever",
      industry: "FMCG and Marketing",
      sessionTopic: "Brand Building, Consumer Behaviour and Marketing Strategies",
      day: 1,
      sortOrder: 2,
    },
    {
      name: "Kalyan Krishnamurthy",
      designation: "Group CEO, Flipkart",
      industry: "E-commerce and Digital Business",
      sessionTopic: "Business Expansion, Competition and E-commerce Growth",
      day: 1,
      sortOrder: 3,
    },
    {
      name: "K. Krithivasan",
      designation: "CEO and MD, Tata Consultancy Services",
      industry: "IT and Technology",
      sessionTopic: "Artificial Intelligence, Digital Transformation and Future Business",
      day: 2,
      sortOrder: 4,
    },
    {
      name: "Anup Bagchi",
      designation: "MD and CEO, HDFC Bank",
      industry: "Banking and Finance",
      sessionTopic: "Financial Management, Risk and Sustainable Business Growth",
      day: 2,
      sortOrder: 5,
    },
    {
      name: "C. Vijayakumar",
      designation: "CEO and MD, HCLTech",
      industry: "IT Services and Technology",
      sessionTopic: "Global Business Leadership, Innovation and Organisational Growth",
      day: 2,
      sortOrder: 6,
    },
  ];

  for (const s of speakersData) {
    const existing = await prisma.speaker.findFirst({
      where: { eventId: event.id, name: s.name },
    });
    if (!existing) {
      await prisma.speaker.create({
        data: {
          eventId: event.id,
          ...s,
          status: "Proposed",
        },
      });
    }
  }

  // ========== AGENDA / SESSIONS ==========
  const day1Sessions = [
    { startTime: "09:30", endTime: "10:00", title: "Registration", description: "Guest arrival and welcome", type: "registration", sortOrder: 1 },
    { startTime: "10:00", endTime: "10:15", title: "Inauguration and lamp lighting", description: "Organising Team", type: "inauguration", sortOrder: 2 },
    { startTime: "10:15", endTime: "11:15", title: "From Startup to Success", description: "Falguni Nayar", type: "keynote", sortOrder: 3 },
    { startTime: "11:15", endTime: "11:30", title: "Tea and refreshments", description: "Break", type: "break", sortOrder: 4 },
    { startTime: "11:30", endTime: "12:30", title: "Brand Building and Consumer Behaviour", description: "Priya Nair", type: "keynote", sortOrder: 5 },
    { startTime: "12:30", endTime: "13:30", title: "Business Expansion and E-commerce Growth", description: "Kalyan Krishnamurthy", type: "keynote", sortOrder: 6 },
    { startTime: "13:30", endTime: "14:30", title: "Lunch and Networking", description: "", type: "lunch", sortOrder: 7 },
    { startTime: "14:30", endTime: "15:30", title: "Interactive CEO Round Table Discussion", description: "All Day 1 Speakers", type: "roundtable", sortOrder: 8 },
    { startTime: "15:30", endTime: "16:00", title: "Audience Q&A and Closing Remarks", description: "All Day 1 Speakers", type: "qa", sortOrder: 9 },
  ];

  const day2Sessions = [
    { startTime: "09:30", endTime: "10:00", title: "Guest arrival and registration", description: "Organising Team", type: "registration", sortOrder: 1 },
    { startTime: "10:00", endTime: "11:00", title: "AI and the Future of Business", description: "K. Krithivasan", type: "keynote", sortOrder: 2 },
    { startTime: "11:00", endTime: "11:15", title: "Tea Break", description: "", type: "break", sortOrder: 3 },
    { startTime: "11:15", endTime: "12:15", title: "Financial Management and Business Sustainability", description: "Anup Bagchi", type: "keynote", sortOrder: 4 },
    { startTime: "12:15", endTime: "13:15", title: "Global Leadership and Innovation", description: "C. Vijayakumar", type: "keynote", sortOrder: 5 },
    { startTime: "13:15", endTime: "14:15", title: "Lunch and Networking", description: "", type: "lunch", sortOrder: 6 },
    { startTime: "14:15", endTime: "15:15", title: "Interactive CEO Round Table Discussion", description: "All Day 2 Speakers", type: "roundtable", sortOrder: 7 },
    { startTime: "15:15", endTime: "15:45", title: "Audience Interaction and Q&A", description: "All Day 2 Speakers", type: "qa", sortOrder: 8 },
    { startTime: "15:45", endTime: "16:00", title: "Closing Ceremony and Vote of Thanks", description: "Organising Team", type: "closing", sortOrder: 9 },
  ];

  for (const s of day1Sessions) {
    const existing = await prisma.session.findFirst({
      where: { eventId: event.id, day: 1, title: s.title },
    });
    if (!existing) {
      await prisma.session.create({
        data: { eventId: event.id, day: 1, ...s, isVisible: true },
      });
    }
  }

  for (const s of day2Sessions) {
    const existing = await prisma.session.findFirst({
      where: { eventId: event.id, day: 2, title: s.title },
    });
    if (!existing) {
      await prisma.session.create({
        data: { eventId: event.id, day: 2, ...s, isVisible: true },
      });
    }
  }

  // ========== SPONSOR CATEGORIES ==========
  const sponsorCats = [
    { name: "Title Sponsor", benefits: "Main event naming and prominent branding", sortOrder: 1 },
    { name: "Presenting Sponsor", benefits: "Stage branding and promotional visibility", sortOrder: 2 },
    { name: "Gold Sponsor", benefits: "Logo placement and promotional opportunities", sortOrder: 3 },
    { name: "Silver Sponsor", benefits: "Website and event material branding", sortOrder: 4 },
    { name: "Technology Partner", benefits: "Digital and technical support", sortOrder: 5 },
    { name: "Hospitality Partner", benefits: "Guest hospitality association", sortOrder: 6 },
  ];

  for (const c of sponsorCats) {
    const existing = await prisma.sponsorCategory.findFirst({
      where: { eventId: event.id, name: c.name },
    });
    if (!existing) {
      await prisma.sponsorCategory.create({
        data: { eventId: event.id, ...c },
      });
    }
  }

  // ========== FORM FIELDS ==========
  const formFields = [
    { key: "fullName", label: "Full Name", type: "text", isRequired: true, sortOrder: 1 },
    { key: "email", label: "Email Address", type: "email", isRequired: true, sortOrder: 2 },
    { key: "mobile", label: "Mobile Number", type: "tel", isRequired: true, sortOrder: 3 },
    { key: "organisation", label: "Organisation / Company", type: "text", isRequired: true, sortOrder: 4 },
    { key: "designation", label: "Designation", type: "text", isRequired: true, sortOrder: 5 },
    {
      key: "audienceCategory",
      label: "Audience Category",
      type: "select",
      isRequired: true,
      sortOrder: 6,
      options: [
        "CEO / Business Leader",
        "Entrepreneur / Startup Founder",
        "Corporate Professional",
        "MBA / BBA Student",
        "Investor / Industry Representative",
        "Other",
      ],
    },
    { key: "city", label: "City", type: "text", isRequired: false, sortOrder: 7 },
    {
      key: "daysAttending",
      label: "Days Attending",
      type: "select",
      isRequired: true,
      sortOrder: 8,
      options: ["Day 1", "Day 2", "Both"],
    },
    { key: "linkedinUrl", label: "LinkedIn Profile URL", type: "text", isRequired: false, sortOrder: 9 },
    { key: "whyAttend", label: "Why do you want to attend?", type: "textarea", isRequired: false, sortOrder: 10 },
    {
      key: "studentIdOrCollege",
      label: "Student ID or College Name",
      type: "text",
      isRequired: false,
      sortOrder: 11,
      showWhen: { field: "audienceCategory", value: "MBA / BBA Student" },
    },
  ];

  for (const f of formFields) {
    await prisma.formField.upsert({
      where: { key: f.key },
      update: {},
      create: {
        key: f.key,
        label: f.label,
        type: f.type,
        isRequired: f.isRequired,
        isVisible: true,
        sortOrder: f.sortOrder,
        options: f.options ? f.options : undefined,
        showWhen: f.showWhen ? f.showWhen : undefined,
      },
    });
  }

  // ========== EMAIL TEMPLATES ==========
  const templates = [
    {
      key: "request_received",
      name: "Invitation Request Received",
      subject: "We received your invitation request – THE CEO CONCLAVE 2027",
      heading: "Request Received",
      bodyHtml: `<p>Dear {{attendee_name}},</p>
<p>Thank you for your interest in <strong>THE CEO CONCLAVE 2027</strong>.</p>
<p>We have received your invitation request (Reference: <strong>{{reference_id}}</strong>). Our team will review it and get back to you shortly.</p>
<p>You can check your request status anytime using your email and reference ID.</p>
<p>Best regards,<br/>Team CEO Conclave 2027</p>`,
      variables: ["attendee_name", "reference_id", "event_name"],
    },
    {
      key: "request_approved",
      name: "Invitation Approved + Digital Pass",
      subject: "Your invitation is approved – THE CEO CONCLAVE 2027",
      heading: "You're Invited!",
      bodyHtml: `<p>Dear {{attendee_name}},</p>
<p>Great news! Your invitation request for <strong>THE CEO CONCLAVE 2027</strong> has been <strong>approved</strong>.</p>
<p><strong>Pass Number:</strong> {{pass_number}}<br/>
<strong>Registration ID:</strong> {{registration_id}}<br/>
<strong>Days:</strong> {{days_approved}}</p>
<p>Please find your digital pass with QR code here: <a href="{{pass_url}}">View Digital Pass</a></p>
<p>Present the QR code at the venue for entry. Keep this email safe.</p>
<p>Your organiser contact: {{contact_name}} ({{contact_phone}})</p>
<p>We look forward to seeing you in Bengaluru!</p>
<p>Best regards,<br/>Team CEO Conclave 2027</p>`,
      variables: ["attendee_name", "pass_number", "registration_id", "days_approved", "pass_url", "contact_name", "contact_phone", "event_name", "event_date", "event_venue"],
    },
    {
      key: "request_waitlisted",
      name: "Invitation Waitlisted",
      subject: "Your invitation request is on the waitlist – THE CEO CONCLAVE 2027",
      heading: "You're on the Waitlist",
      bodyHtml: `<p>Dear {{attendee_name}},</p>
<p>Thank you for your interest in THE CEO CONCLAVE 2027. Your request ({{reference_id}}) has been placed on the waitlist due to limited capacity.</p>
<p>We will notify you if a place becomes available.</p>
<p>Best regards,<br/>Team CEO Conclave 2027</p>`,
      variables: ["attendee_name", "reference_id"],
    },
    {
      key: "request_rejected",
      name: "Invitation Not Approved",
      subject: "Update on your invitation request – THE CEO CONCLAVE 2027",
      heading: "Request Update",
      bodyHtml: `<p>Dear {{attendee_name}},</p>
<p>Thank you for your interest in THE CEO CONCLAVE 2027. After careful review, we are unable to accommodate your request at this time.</p>
<p>We appreciate your understanding and hope to connect at future editions.</p>
<p>Best regards,<br/>Team CEO Conclave 2027</p>`,
      variables: ["attendee_name", "reference_id"],
    },
    {
      key: "direct_invitation",
      name: "Direct Invitation",
      subject: "You are invited to THE CEO CONCLAVE 2027",
      heading: "Exclusive Invitation",
      bodyHtml: `<p>Dear {{attendee_name}},</p>
<p>You have been personally invited to <strong>THE CEO CONCLAVE 2027</strong>.</p>
<p>Please use this unique link to complete your registration: <a href="{{invite_link}}">Accept Invitation</a></p>
<p>This invitation expires on {{expires_at}}.</p>
<p>Best regards,<br/>Team CEO Conclave 2027</p>`,
      variables: ["attendee_name", "invite_link", "expires_at"],
    },
    {
      key: "sponsor_enquiry_received",
      name: "Sponsor Enquiry Acknowledgement",
      subject: "We received your sponsorship enquiry – THE CEO CONCLAVE 2027",
      heading: "Thank You",
      bodyHtml: `<p>Dear {{contact_person}},</p>
<p>Thank you for your interest in sponsoring THE CEO CONCLAVE 2027. We have received your enquiry and will get back to you shortly.</p>
<p>Best regards,<br/>Team CEO Conclave 2027</p>`,
      variables: ["contact_person", "company_name"],
    },
    {
      key: "contact_form_ack",
      name: "Contact Form Acknowledgement",
      subject: "We received your message – THE CEO CONCLAVE 2027",
      heading: "Message Received",
      bodyHtml: `<p>Dear {{name}},</p>
<p>Thank you for contacting us. We have received your message and will respond as soon as possible.</p>
<p>Best regards,<br/>Team CEO Conclave 2027</p>`,
      variables: ["name"],
    },
  ];

  for (const t of templates) {
    await prisma.emailTemplate.upsert({
      where: { key: t.key },
      update: {},
      create: {
        key: t.key,
        name: t.name,
        subject: t.subject,
        heading: t.heading,
        bodyHtml: t.bodyHtml,
        variables: t.variables,
        isActive: true,
      },
    });
  }

  // ========== SYSTEM SETTING: setup completed flag ==========
  await prisma.systemSetting.upsert({
    where: { key: "setup_completed" },
    update: {},
    create: { key: "setup_completed", value: "false" },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
