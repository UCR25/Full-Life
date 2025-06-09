// import { saveUserProfile } from '../utils/storage';
// import { clearDraft }      from '../utils/draft';

// async function submit() {
//   const payload = {
//     user_id:  draft.user_id!,
//     username: draft.username!,
//     email,
//     hobbies,
//   };

//   try {
//     const res = await axios.post('/api/profiles', payload);
//     // 1) store the returned ProfileOut in localStorage
//     saveUserProfile(res.data);

//     // 2) clear the draft now that it’s finalized
//     clearDraft();

//     // 3) redirect to dashboard / home
//     navigate('/dashboard');
//   } catch (err) {
//     console.error(err);
//     alert('Submission failed');
//   }
// }
