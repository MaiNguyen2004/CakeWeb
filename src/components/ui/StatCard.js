const StatCard = ({ title, value, icon: Icon, textColor }) => (
    <div className="bg-white p-3 rounded-xl shadow-sm w-full">
        <Icon size={24} className={`${textColor} mb-2`} />
        <div className={`flex justify-between items-center ${textColor} font-bold`}>
            <h4>{title}</h4>
            <h4>{value}</h4>
        </div>
    </div>
);
export default StatCard