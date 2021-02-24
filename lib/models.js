export const UserModel = {
  _id: null,
  license: '',
  fullname: '',
  username: '',
  email: '',
  licenseOwner: false,
  verified: false,
  disabled: false,
  gender: '',
  phone: '',
  roles: [],
  hashed_password: '',
  createdBy: null,
  createdAt: null,
  updatedAt: null,
}

export const GuestModel = {
  _id: null,
  projectId: '',
  type: '', // client || expert
  license: '',
  fullname: '',
  // username: '',
  email: '',
  phone: '',
  hashed_password: '',
  verified: false,
  disabled: false,
  createdBy: null,
  createdAt: null,
  updatedAt: null,
}

export const ProjectModel = {
  _id: null,
  license: null,
  clientId: null,
  status: null,
  /* Administrative */
  title: '',
  shortTitle: '',
  description: '',
  startDate: null,
  endDate: null,

  admin: null,
  contacts: [],            // { type, name, phone, email }
  // groups: [],
  /* Deployment */
  accessCode: null,
  openingDate: null,
  closingDate: null,

  createdBy: null,
  createdAt: null,
  updatedAt: null,
}

export const ClientModel = {
  _id: null,
  license: '',
  name: '',
  address: '',
  city: '',
  phone: null,
  contacts: [],
  createdBy: null,
  createdAt: null,
  updatedAt: null
}

export const PersonaModel = {
  _id: null,
  license: null,
  projectId: null,
  disabled: false,

  username: '',
  email: '',
  fullname: '',
  gender: '',
  birth: '',
  phone: '',

  nip: '',
  position: '',
  currentLevel: '',
  targetLevel: '',

  group: '',
  simGroup: '',
  tests: [],
  sims: [],

  currentTest: null,
  currentSim: null,

  testsPerformed: [],
  simsPerformed: [],

  hashed_password: '',
  createdBy: null,
  createdAt: null,
  updatedAt: null,
  xfpwd: '',
}