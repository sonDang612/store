import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Form, Modal } from "antd";
import Image from "next/image";
import { useSelector } from "react-redux";

import { useMutationDeleteUserAddress } from "@/src/react-query/hooks/user/useMutationDeleteAddress";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { ModalAddressType } from "@/src/redux/reducers/modalAddressReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { getDistricts, getWards } from "@/utils/getProvinces";

import FormAddress from "./FormAddress";
import SingleAddress from "./SingleAddress";

const Address = () => {
  const { visible } = useSelector<RootState, ModalAddressType>(
    (state) => state.modalAddress,
  );
  const actions = useActions();
  const { data: user } = useUserData(false, false);
  const [form] = Form.useForm();

  const { mutate: deleteAddress } = useMutationDeleteUserAddress();

  const handleOpenModalUpdate = (address: any, i: any) => {
    const newState: Partial<ModalAddressType> = {
      visible: true,
      addressId: address._id,
    };
    form.setFieldsValue({
      fullName: address.name,
      phoneNumber: address.phone,
      city: address.city,
      district: address.district,
      ward: address.ward,
      address: address.address,
      defaultAddress: i === 0,
    });

    if (i === 0) newState.defaultAddress = true;
    else newState.defaultAddress = false;

    if (address._id) {
      newState.district = getDistricts(address.city);
      newState.ward = getWards(address.city, address.district);
    }

    actions.setModalAddressState({ ...newState });
  };
  const handleDeleteAddress = (addressId: string) => {
    Modal.confirm({
      title: "Do you really want to delete this address ?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteAddress({
          addressId,
        });
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <Modal
        open={visible}
        centered
        title={"Address"}
        onOk={() => {
          actions.openModalAddress();
        }}
        onCancel={() => {
          actions.hideModalAddress();
        }}
        footer={null}
        className=" rounded-sm"
        // preserve={false}
        // maskClosable={false}
      >
        <FormAddress form={form} />
      </Modal>
      <div className="mt-2 space-y-3">
        <div>
          <Button
            type="dashed"
            block
            className=" flex justify-center items-center space-x-4 h-14"
            onClick={() => {
              form.resetFields();
              form.setFieldValue("fullName", user.name);
              actions.openModalAddress();
            }}
          >
            <Image src="/images/plus.svg" alt="plus" width={28} height={28} />
            <span className=" text-lg" style={{ color: "#2196fc" }}>
              {" "}
              Add address
            </span>
          </Button>
        </div>
        {user?.addressList?.map((address: any, i) => {
          return (
            <SingleAddress
              key={address._id}
              address={address}
              i={i}
              handleOpenModalUpdate={handleOpenModalUpdate}
              handleDeleteAddress={handleDeleteAddress}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Address;
