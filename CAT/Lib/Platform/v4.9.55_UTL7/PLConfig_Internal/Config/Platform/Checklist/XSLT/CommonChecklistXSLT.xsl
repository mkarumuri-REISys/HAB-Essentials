<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:asp="remove" xmlns:rei="remove">
	<xsl:template name="Field">
		<xsl:param name="enabled" />
    <xsl:param name="QSID" />
    <xsl:variable name="actionBtn" select="@ActionButtons = 'All' or @ActionButtons = 'None' or @ActionButtons = 'Edit' or @ActionButtons = 'SaveCancel'"/>
    <xsl:if test="$actionBtn">
      <xsl:variable name="ActionButtons" select="@ActionButtons"/>
      <xsl:call-template name="PartialPostBack">
        <xsl:with-param name="enabled" select="$enabled"/>
        <xsl:with-param name="QSID" select="$QSID"/>
        <xsl:with-param name="ActionButtons" select="$ActionButtons"/>
      </xsl:call-template>
    </xsl:if>
    <xsl:if test="not($actionBtn)">
      <xsl:call-template name="Control">
        <xsl:with-param name="enabled" select="$enabled"/>
        <xsl:with-param name="QSID" select="$QSID"/>
      </xsl:call-template>
    </xsl:if>
	</xsl:template>

	<xsl:template match ="Action">
		<xsl:element name="{@Control}">
			<xsl:attribute name="runat">server</xsl:attribute>
			<xsl:attribute name="ActionId"><xsl:value-of select="@ActionId"/></xsl:attribute>
			<xsl:attribute name="Id">ActionId_<xsl:value-of select="translate(@ActionId,'-','')"/></xsl:attribute>
			<xsl:attribute name="Text"><xsl:value-of select ="@Text"/></xsl:attribute>
			<xsl:if test="(count(@ValidationDisplayType)>0 and @ValidationDisplayType != '')">
				<xsl:attribute name ="ValidationDisplayType"><xsl:value-of select="@ValidationDisplayType"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="(count(@ValidationGroup)>0 and @ValidationGroup != '')">
				<xsl:attribute name ="ValidationGroup"><xsl:value-of select="@ValidationGroup"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="(count(@CommandArgument)>0 and @CommandArgument != '')">
				<xsl:attribute name ="CommandArgument"><xsl:value-of select="@CommandArgument"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="(count(@CommandName)>0 and @CommandName != '')"> 
				<xsl:attribute name ="CommandName"><xsl:value-of select="@CommandName"/></xsl:attribute>
			</xsl:if>
		</xsl:element>
	</xsl:template>

	<xsl:template name="Label">
		<xsl:param name="FieldId" />
		<xsl:param name="Description" />

		<xsl:element name="rei:REILabel">
			<xsl:attribute name="runat">server</xsl:attribute>
			<xsl:attribute name="ID">LabelFieldId_<xsl:value-of select="$FieldId"/></xsl:attribute>
			<xsl:attribute name="Text"><xsl:value-of select="$Description"/></xsl:attribute>
			<xsl:attribute name="AssociatedControlID">FieldId_<xsl:value-of select="$FieldId"/></xsl:attribute>
		</xsl:element>
	</xsl:template>
  <xsl:template name ="ReadOnlyModeButton">
    <xsl:param name="QSID" />
    <xsl:param name="Text" />
    <xsl:param name="Class" />


    <xsl:element name="asp:Button">

      <xsl:attribute name="runat">server</xsl:attribute>
      <xsl:attribute name="id">ID_<xsl:value-of select="translate(@QuestionId,'-','')"/>_<xsl:value-of select="$Text"/>
      </xsl:attribute>
      <xsl:attribute name="QSID">
        <xsl:value-of select="$QSID"/>
      </xsl:attribute>
      <xsl:attribute name="Text">
        <xsl:value-of select="$Text"/>
      </xsl:attribute>
      <xsl:attribute name="class">
        <xsl:value-of select="$Class"/>
      </xsl:attribute>
    </xsl:element >
  </xsl:template>
  <xsl:template name ="SaveAndCancel">
    <xsl:param name="QSID" />
    <xsl:call-template name="ReadOnlyModeButton">
      <xsl:with-param name="QSID" select="$QSID"></xsl:with-param>
      <xsl:with-param name="Text" select="'Save'"></xsl:with-param>
      <xsl:with-param name="Class" select="'hrsaSkingreybtn'"></xsl:with-param>

    </xsl:call-template>
    &#160;
    <xsl:call-template name="ReadOnlyModeButton">
      <xsl:with-param name="QSID" select="$QSID"></xsl:with-param>
      <xsl:with-param name="Text" select="'Cancel'"></xsl:with-param>
      <xsl:with-param name="Class" select="'hrsaSkingreybtn'"></xsl:with-param>
    </xsl:call-template>

  </xsl:template>

  <xsl:template name="Control">
    <xsl:param name="enabled" />
    <xsl:param name="QSID" />
    <xsl:element name="{@Control}">
      <xsl:attribute name="runat">server</xsl:attribute>
      <xsl:attribute name="FieldId">
        <xsl:value-of select="@FieldId"/>
      </xsl:attribute>
      <xsl:if test="@EventToSubscribe != ''">
        <xsl:attribute name="EventToSubscribe">
          <xsl:value-of select="@EventToSubscribe"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="Id">FieldId_<xsl:value-of select="translate(@FieldId,'-','')"/></xsl:attribute>
      <xsl:if test="$enabled != ''">
        <xsl:attribute name="enabled">
          <xsl:value-of select="$enabled"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="AnswerProperty">
        <xsl:value-of select="@AnswerProperty"/>
      </xsl:attribute>
      <xsl:attribute name="QSID">
        <xsl:value-of select="translate($QSID,'-','')"/>
      </xsl:attribute>
      <xsl:for-each select="Attributes/Attribute">
        <xsl:attribute name="{@Name}">
          <xsl:value-of select="@Value"/>
        </xsl:attribute>
      </xsl:for-each>
    </xsl:element>
  </xsl:template>

  <xsl:template name="PartialPostBack">
    <xsl:param name="enabled" />
    <xsl:param name="QSID" />
    <xsl:param name="ActionButtons"/>
    <xsl:element name="rei:REIRadAjaxPanel">
      <xsl:attribute name="runat">server</xsl:attribute>
      <xsl:attribute name="Id">RadAjaxPanel_<xsl:value-of select="translate(@FieldId,'-','')"/></xsl:attribute>
      <xsl:attribute name="EnableAJAX">true</xsl:attribute>
      <xsl:element name="asp:Panel">
        <xsl:attribute name="runat">server</xsl:attribute>
        <xsl:attribute name="Id">pnl_<xsl:value-of select="translate(@FieldId,'-','')"/></xsl:attribute>
        <xsl:call-template name="Control">
          <xsl:with-param name="enabled" select="$enabled"/>
          <xsl:with-param name="QSID" select="$QSID"/>
        </xsl:call-template>
        <br/>
        <xsl:choose>
          <!--<xsl:when test="$ActionButtons = 'Edit'">
            <xsl:call-template name="DisplayEditButton"/>
          </xsl:when>-->
          <xsl:when test="$ActionButtons = 'SaveCancel'">
            <xsl:call-template name="DisplaySaveCancelButtons"/>
          </xsl:when>
          <xsl:when test="$ActionButtons = 'All'">
            <!--<xsl:call-template name="DisplayEditButton"/>-->
            <xsl:call-template name="DisplaySaveCancelButtons"/>
          </xsl:when>
        </xsl:choose>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <xsl:template name="DisplayEditButton">
    <xsl:element name="rei:REIASPButton">
      <xsl:attribute name="runat">server</xsl:attribute>
      <xsl:attribute name="Id">ImageButton_<xsl:value-of select="translate(@FieldId,'-','')"/></xsl:attribute>
      <xsl:attribute name="CssClass">update tooltip</xsl:attribute>
      <xsl:attribute name="EventToSubscribe">Click</xsl:attribute>
    </xsl:element>
  </xsl:template>
  
  <xsl:template name="DisplaySaveCancelButtons">
    <xsl:element name="rei:REIASPButton">
      <xsl:attribute name="runat">server</xsl:attribute>
      <xsl:attribute name="Text">Save</xsl:attribute>
      <xsl:attribute name="CssClass">hrsaSkingreybtn</xsl:attribute>
      <xsl:attribute name="Id">btnSave_<xsl:value-of select="translate(@FieldId,'-','')"/></xsl:attribute>
      <xsl:attribute name="EventToSubscribe">Click</xsl:attribute>
      <xsl:attribute name="ValidationGroup">
        <xsl:value-of select="@ValidationGroup"></xsl:value-of>
      </xsl:attribute>     
    </xsl:element>
    <xsl:element name="rei:REIASPButton">
      <xsl:attribute name="runat">server</xsl:attribute>
      <xsl:attribute name="Text">Cancel</xsl:attribute>
      <xsl:attribute name="CssClass">hrsaSkingreybtn</xsl:attribute>
      <xsl:attribute name="Id">btnCancel_<xsl:value-of select="translate(@FieldId,'-','')"/></xsl:attribute>
      <xsl:attribute name="CausesValidation">false</xsl:attribute>
      <xsl:attribute name="EventToSubscribe">Click</xsl:attribute>
    </xsl:element>
  </xsl:template>

  <xsl:template name="RadAjaxManagerTemplate">
    <xsl:param name="PanelID"/>
    <xsl:param name="FieldId"/>
    <xsl:element name="rei:REIRadAjaxManager">
      <xsl:attribute name="runat">server</xsl:attribute>
      <xsl:attribute name="Id">RadAjaxManager_<xsl:value-of select="translate($FieldId,'-','')"/></xsl:attribute>
      <xsl:element name="AjaxSettings">
        <xsl:element name="rei:REIRadAjaxSetting">
          <xsl:attribute name="AjaxControlID">btnSave_<xsl:value-of select="translate($FieldId,'-','')"/></xsl:attribute>
          <xsl:element name="UpdatedControls">
            <xsl:element name="rei:REIRadAjaxUpdatedControl">
              <xsl:attribute name="ControlID">RadAjaxPanel_<xsl:value-of select="translate($FieldId,'-','')"/></xsl:attribute>
            </xsl:element>
            <xsl:element name="rei:REIRadAjaxUpdatedControl">
              <xsl:attribute name="ControlID"><xsl:value-of select="$PanelID"/></xsl:attribute>
            </xsl:element>
          </xsl:element>
        </xsl:element>
      </xsl:element>
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>

