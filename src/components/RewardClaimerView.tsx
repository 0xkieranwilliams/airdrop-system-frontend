import ClaimRewards from "./ClaimRewards";


const RewardClaimerView = () => {
  return (<>
        <hr className="mb-4" />
        <h2 className="text-3xl mb-4 font-semibold">Normal User</h2>

        {/* Normal User Section */}
        <ClaimRewards />
  </>)
};

export default RewardClaimerView;
