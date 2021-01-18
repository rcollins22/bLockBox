const BLockBox = artifacts.require("./BLockBox.sol");

require("chai").use(require("chai-as-promised")).should();

contract("BLockBox", ([deployer, uploader]) => {
  let blockbox;

  before(async () => {
    blockbox = await BLockBox.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await blockbox.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await blockbox.name();
      assert.equal(name, 'bLockBox');
    });
  });

  describe("file", async () => {
    let result, idCount;
    const fileHash = "QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb";
    const fileSize = "1";
    const fileType = "TypeOfTheFile";
    const fileName = "NameOfTheFile";
    const fileDescription = "DescriptionOfTheFile";

    before(async () => {
      result = await blockbox.upload(
        fileHash,
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      );
      idCount = await blockbox.idCount();
    });

    //check event
    it("upload file", async () => {
      // SUCESS
      assert.equal(idCount, 1);
      const event = result.logs[0].args;
      assert.equal(
        event.fileID.toNumber(),
        idCount.toNumber(),
        "Id is correct"
      );
      assert.equal(event.fileHash, fileHash, "Hash is correct");
      assert.equal(event.fileSize, fileSize, "Size is correct");
      assert.equal(event.fileType, fileType, "Type is correct");
      assert.equal(event.fileName, fileName, "Name is correct");
      assert.equal(
        event.fileDescription,
        fileDescription,
        "Description is correct"
      );
      assert.equal(event.uploader, uploader, "Uploader is correct");

      // FAILURE: File must have hash
      await blockbox.upload(
        "",
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      ).should.be.rejected;

      // FAILURE: File must have size
      await blockbox.upload(
        fileHash,
        "",
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      ).should.be.rejected;

      // FAILURE: File must have type
      await blockbox.upload(
        fileHash,
        fileSize,
        "",
        fileName,
        fileDescription,
        { from: uploader }
      ).should.be.rejected;

      // FAILURE: File must have name
      await blockbox.upload(
        fileHash,
        fileSize,
        fileType,
        "",
        fileDescription,
        { from: uploader }
      ).should.be.rejected;

      // FAILURE: File must have description
      await blockbox.upload(fileHash, fileSize, fileType, fileName, "", {
        from: uploader,
      }).should.be.rejected;
    });

    // it("lists file", async () => {
    //   const file = await blockbox.files(idCount);
    //   console.log("FILE ID", file.fileID)
    //   console.log("ID COUNT",idCount)
    //   assert.equal(
    //     file.fileId.toNumber(),
    //     idCount.toNumber(),
    //     "id is correct"
    //   );
    //   assert.equal(file.fileHash, fileHash, "Hash is correct");
    //   assert.equal(file.fileSize, fileSize, "Size is correct");
    //   assert.equal(file.fileName, fileName, "Size is correct");
    //   assert.equal(
    //     file.fileDescription,
    //     fileDescription,
    //     "description is correct"
    //   );
    //   assert.equal(file.uploader, uploader, "uploader is correct");
    // });
  });
});
