import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

export const IconsList = (props) => {
  switch (props) {
    case "HomeOutlined":
      return <HomeOutlined />;
    case "UserOutlined":
      return <UserOutlined />;
    case "UserAddOutlined":
      return <UserAddOutlined />;
    case "SettingOutlined":
      return <SettingOutlined />;
    default:
      break;
  }
};
